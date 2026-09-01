import {
  ActivityRun,
  ActivityRunPreparationInput,
  prepareActivityRun,
} from "../../domain/activities/activity";
import {
  applyHabitConfiguration,
  Habit,
  Occurrence,
  prepareOccurrence,
} from "../../domain/habits/habit";
import { LocalDate } from "../../domain/shared/time";
import {
  ActivityRunId,
  HabitId,
  OccurrenceId,
} from "../../domain/shared/values";

export interface GoldenJourneySetupTransaction {
  getHabit(id: HabitId): Promise<Habit | null>;
  getOccurrence(id: OccurrenceId): Promise<Occurrence | null>;
  getActivityRun(id: ActivityRunId): Promise<ActivityRun | null>;
  putHabit(habit: Habit): Promise<void>;
  putOccurrence(occurrence: Occurrence): Promise<void>;
  putActivityRun(activityRun: ActivityRun): Promise<void>;
}

export interface GoldenJourneySetupUnitOfWork {
  runInTransaction<Result>(
    operation: (transaction: GoldenJourneySetupTransaction) => Promise<Result>,
  ): Promise<Result>;
}

export interface SetupHabitOccurrenceCommand {
  readonly habit: Habit;
  readonly occurrenceId: OccurrenceId;
  readonly scheduledDate: LocalDate;
}

type SetupFailure = {
  readonly status: "failed";
  readonly code: "transaction_failed";
  readonly retryable: true;
};

export type SetupHabitOccurrenceOutcome =
  | {
      readonly status: "applied" | "unchanged";
      readonly habit: Habit;
      readonly occurrence: Occurrence;
    }
  | {
      readonly status: "rejected";
      readonly code:
        | "identity_mismatch"
        | "stale_version"
        | "same_version_conflict"
        | "tombstone_removal"
        | "habit_unavailable"
        | "inactive_scheduled_date"
        | "occurrence_conflict";
    }
  | SetupFailure;

type WithoutPreparationContext<Input> = Input extends unknown
  ? Omit<Input, "existingActivityRun" | "habit" | "occurrence">
  : never;

export type SetupActivityRunCommand =
  WithoutPreparationContext<ActivityRunPreparationInput>;

export type SetupActivityRunOutcome =
  | {
      readonly status: "applied" | "unchanged";
      readonly activityRun: ActivityRun;
    }
  | {
      readonly status: "rejected";
      readonly code:
        | "invalid_title"
        | "activity_run_conflict"
        | "habit_unavailable"
        | "occurrence_unavailable"
        | "link_mismatch"
        | "activity_type_mismatch";
    }
  | SetupFailure;

export class SetupHabitOccurrenceUseCase {
  constructor(private readonly unitOfWork: GoldenJourneySetupUnitOfWork) {}

  async execute(
    command: SetupHabitOccurrenceCommand,
  ): Promise<SetupHabitOccurrenceOutcome> {
    try {
      return await this.unitOfWork.runInTransaction(async (transaction) => {
        const currentHabit = await transaction.getHabit(command.habit.id);
        const configurationResult =
          currentHabit === null
            ? { status: "applied" as const, habit: command.habit }
            : applyHabitConfiguration(currentHabit, command.habit);

        if (configurationResult.status === "rejected") {
          return configurationResult;
        }

        const existingOccurrence = await transaction.getOccurrence(
          command.occurrenceId,
        );
        const occurrenceResult = prepareOccurrence({
          id: command.occurrenceId,
          habit: configurationResult.habit,
          scheduledDate: command.scheduledDate,
          existingOccurrence,
        });

        if (occurrenceResult.status === "rejected") {
          return occurrenceResult;
        }

        const habitNeedsWrite =
          currentHabit === null || configurationResult.status === "applied";
        const occurrenceNeedsWrite = occurrenceResult.status === "created";

        if (habitNeedsWrite) {
          await transaction.putHabit(configurationResult.habit);
        }
        if (occurrenceNeedsWrite) {
          await transaction.putOccurrence(occurrenceResult.occurrence);
        }

        return {
          status:
            habitNeedsWrite || occurrenceNeedsWrite ? "applied" : "unchanged",
          habit: configurationResult.habit,
          occurrence: occurrenceResult.occurrence,
        };
      });
    } catch {
      return transactionFailure();
    }
  }
}

export class SetupActivityRunUseCase {
  constructor(private readonly unitOfWork: GoldenJourneySetupUnitOfWork) {}

  async execute(
    command: SetupActivityRunCommand,
  ): Promise<SetupActivityRunOutcome> {
    try {
      return await this.unitOfWork.runInTransaction(async (transaction) => {
        const existingActivityRun = await transaction.getActivityRun(
          command.id,
        );
        const result =
          command.linkMode === "linked"
            ? prepareActivityRun({
                ...command,
                habit:
                  existingActivityRun === null
                    ? await transaction.getHabit(command.habitId)
                    : null,
                occurrence:
                  existingActivityRun === null
                    ? await transaction.getOccurrence(command.occurrenceId)
                    : null,
                existingActivityRun,
              })
            : prepareActivityRun({ ...command, existingActivityRun });

        if (result.status === "rejected") {
          return result;
        }

        if (result.status === "created") {
          await transaction.putActivityRun(result.activityRun);
        }

        return {
          status: result.status === "created" ? "applied" : "unchanged",
          activityRun: result.activityRun,
        };
      });
    } catch {
      return transactionFailure();
    }
  }
}

function transactionFailure(): SetupFailure {
  return {
    status: "failed",
    code: "transaction_failed",
    retryable: true,
  };
}
