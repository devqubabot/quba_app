import { ActivityRun } from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import { localDate } from "../../domain/shared/time";
import {
  ActivityRunId,
  activityRunId,
  configurationVersion,
  HabitId,
  habitId,
  OccurrenceId,
  occurrenceId,
  progressValue,
  targetValue,
} from "../../domain/shared/values";
import {
  GoldenJourneySetupTransaction,
  GoldenJourneySetupUnitOfWork,
  SetupActivityRunUseCase,
  SetupHabitOccurrenceUseCase,
} from "./setupGoldenJourney";

const HABIT_ID = habitId("habit-dzikir");
const OCCURRENCE_ID = occurrenceId("occurrence-dzikir-2026-08-31");
const RUN_ID = activityRunId("run-dzikir");

const habit: Habit = {
  id: HABIT_ID,
  name: "Dzikir",
  type: "counter",
  targetValue: targetValue(33),
  activeDays: [1],
  enabled: true,
  archivedAt: null,
  configVersion: configurationVersion(1),
};

const occurrence: Occurrence = {
  id: OCCURRENCE_ID,
  habitId: HABIT_ID,
  habitConfigVersion: habit.configVersion,
  activityType: habit.type,
  targetValue: habit.targetValue,
  activeDays: habit.activeDays,
  scheduledDate: localDate("2026-08-31"),
  status: "pending",
  completedValue: progressValue(0),
  completedAt: null,
};

class RecordingSetupTransaction implements GoldenJourneySetupTransaction {
  readonly writes: string[] = [];

  constructor(
    private currentHabit: Habit | null = null,
    private currentOccurrence: Occurrence | null = null,
    private currentActivityRun: ActivityRun | null = null,
  ) {}

  async getHabit(_id: HabitId): Promise<Habit | null> {
    return this.currentHabit;
  }

  async getOccurrence(_id: OccurrenceId): Promise<Occurrence | null> {
    return this.currentOccurrence;
  }

  async getActivityRun(_id: ActivityRunId): Promise<ActivityRun | null> {
    return this.currentActivityRun;
  }

  async putHabit(value: Habit): Promise<void> {
    this.writes.push("habit");
    this.currentHabit = value;
  }

  async putOccurrence(value: Occurrence): Promise<void> {
    this.writes.push("occurrence");
    this.currentOccurrence = value;
  }

  async putActivityRun(value: ActivityRun): Promise<void> {
    this.writes.push("activity-run");
    this.currentActivityRun = value;
  }
}

class RecordingSetupUnitOfWork implements GoldenJourneySetupUnitOfWork {
  transactionCount = 0;

  constructor(readonly transaction: RecordingSetupTransaction) {}

  async runInTransaction<Result>(
    operation: (transaction: GoldenJourneySetupTransaction) => Promise<Result>,
  ): Promise<Result> {
    this.transactionCount += 1;
    return operation(this.transaction);
  }
}

class FailingSetupUnitOfWork implements GoldenJourneySetupUnitOfWork {
  async runInTransaction<Result>(
    _operation: (transaction: GoldenJourneySetupTransaction) => Promise<Result>,
  ): Promise<Result> {
    throw new Error("simulated transaction failure");
  }
}

describe("SetupHabitOccurrenceUseCase", () => {
  it("persists a new habit and occurrence through one transaction", async () => {
    const transaction = new RecordingSetupTransaction();
    const unitOfWork = new RecordingSetupUnitOfWork(transaction);
    const useCase = new SetupHabitOccurrenceUseCase(unitOfWork);

    const result = await useCase.execute({
      habit,
      occurrenceId: OCCURRENCE_ID,
      scheduledDate: occurrence.scheduledDate,
    });

    expect(result).toEqual({ status: "applied", habit, occurrence });
    expect(unitOfWork.transactionCount).toBe(1);
    expect(transaction.writes).toEqual(["habit", "occurrence"]);
  });

  it("treats an identical setup retry as a no-write result", async () => {
    const transaction = new RecordingSetupTransaction(habit, occurrence);
    const useCase = new SetupHabitOccurrenceUseCase(
      new RecordingSetupUnitOfWork(transaction),
    );

    await expect(
      useCase.execute({
        habit: { ...habit },
        occurrenceId: OCCURRENCE_ID,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({ status: "unchanged", habit, occurrence });
    expect(transaction.writes).toEqual([]);
  });

  it("applies a newer configuration with its new occurrence atomically", async () => {
    const transaction = new RecordingSetupTransaction(habit);
    const useCase = new SetupHabitOccurrenceUseCase(
      new RecordingSetupUnitOfWork(transaction),
    );
    const proposedHabit: Habit = {
      ...habit,
      activeDays: [2],
      configVersion: configurationVersion(2),
    };

    const result = await useCase.execute({
      habit: proposedHabit,
      occurrenceId: occurrenceId("occurrence-dzikir-2026-09-01"),
      scheduledDate: localDate("2026-09-01"),
    });

    expect(result).toMatchObject({
      status: "applied",
      habit: proposedHabit,
      occurrence: {
        habitConfigVersion: proposedHabit.configVersion,
        activeDays: proposedHabit.activeDays,
        scheduledDate: "2026-09-01",
      },
    });
    expect(transaction.writes).toEqual(["habit", "occurrence"]);
  });

  it("rejects stale configuration and occurrence conflicts without writes", async () => {
    const currentHabit = {
      ...habit,
      configVersion: configurationVersion(2),
    };
    const transaction = new RecordingSetupTransaction(currentHabit, occurrence);
    const useCase = new SetupHabitOccurrenceUseCase(
      new RecordingSetupUnitOfWork(transaction),
    );

    await expect(
      useCase.execute({
        habit,
        occurrenceId: OCCURRENCE_ID,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({ status: "rejected", code: "stale_version" });
    expect(transaction.writes).toEqual([]);

    await expect(
      useCase.execute({
        habit: {
          ...currentHabit,
          targetValue: targetValue(44),
          configVersion: configurationVersion(3),
        },
        occurrenceId: OCCURRENCE_ID,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({
      status: "rejected",
      code: "occurrence_conflict",
    });
    expect(transaction.writes).toEqual([]);
  });

  it("translates transaction failure into a retryable outcome", async () => {
    const useCase = new SetupHabitOccurrenceUseCase(
      new FailingSetupUnitOfWork(),
    );

    await expect(
      useCase.execute({
        habit,
        occurrenceId: OCCURRENCE_ID,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({
      status: "failed",
      code: "transaction_failed",
      retryable: true,
    });
  });
});

describe("SetupActivityRunUseCase", () => {
  it("persists a linked activity only with compatible context", async () => {
    const transaction = new RecordingSetupTransaction(habit, occurrence);
    const unitOfWork = new RecordingSetupUnitOfWork(transaction);
    const useCase = new SetupActivityRunUseCase(unitOfWork);

    const result = await useCase.execute({
      id: RUN_ID,
      type: "counter",
      title: "Dzikir 33 kali",
      targetValue: targetValue(33),
      linkMode: "linked",
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
    });

    expect(result).toMatchObject({
      status: "applied",
      activityRun: {
        linkMode: "linked",
        habitId: HABIT_ID,
        occurrenceId: OCCURRENCE_ID,
      },
    });
    expect(transaction.writes).toEqual(["activity-run"]);
  });

  it("persists a standalone activity without habit state", async () => {
    const transaction = new RecordingSetupTransaction();
    const useCase = new SetupActivityRunUseCase(
      new RecordingSetupUnitOfWork(transaction),
    );

    const result = await useCase.execute({
      id: activityRunId("standalone-run"),
      type: "session",
      title: "Bereskan meja",
      targetValue: targetValue(15),
      linkMode: "standalone",
    });

    expect(result).toMatchObject({
      status: "applied",
      activityRun: {
        linkMode: "standalone",
        habitId: null,
        occurrenceId: null,
      },
    });
    expect(transaction.writes).toEqual(["activity-run"]);
  });

  it("treats identical linked and standalone run retries as no-write outcomes", async () => {
    const linkedRun: ActivityRun = {
      id: RUN_ID,
      type: "counter",
      title: "Dzikir 33 kali",
      targetValue: targetValue(33),
      currentValue: progressValue(12),
      status: "active",
      linkMode: "linked",
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
      startedAt: null,
      completedAt: null,
    };
    const linkedTransaction = new RecordingSetupTransaction(
      habit,
      occurrence,
      linkedRun,
    );
    const linkedUseCase = new SetupActivityRunUseCase(
      new RecordingSetupUnitOfWork(linkedTransaction),
    );

    await expect(
      linkedUseCase.execute({
        id: RUN_ID,
        type: "counter",
        title: "Dzikir 33 kali",
        targetValue: targetValue(33),
        linkMode: "linked",
        habitId: HABIT_ID,
        occurrenceId: OCCURRENCE_ID,
      }),
    ).resolves.toEqual({ status: "unchanged", activityRun: linkedRun });
    expect(linkedTransaction.writes).toEqual([]);

    const standaloneRun: ActivityRun = {
      id: activityRunId("standalone-retry"),
      type: "session",
      title: "Bereskan meja",
      targetValue: targetValue(15),
      currentValue: progressValue(7),
      status: "paused",
      linkMode: "standalone",
      habitId: null,
      occurrenceId: null,
      startedAt: null,
      completedAt: null,
    };
    const standaloneTransaction = new RecordingSetupTransaction(
      null,
      null,
      standaloneRun,
    );
    const standaloneUseCase = new SetupActivityRunUseCase(
      new RecordingSetupUnitOfWork(standaloneTransaction),
    );

    await expect(
      standaloneUseCase.execute({
        id: standaloneRun.id,
        type: "session",
        title: "Bereskan meja",
        targetValue: targetValue(15),
        linkMode: "standalone",
      }),
    ).resolves.toEqual({ status: "unchanged", activityRun: standaloneRun });
    expect(standaloneTransaction.writes).toEqual([]);
  });

  it("rejects unavailable linked context without writes", async () => {
    const transaction = new RecordingSetupTransaction();
    const useCase = new SetupActivityRunUseCase(
      new RecordingSetupUnitOfWork(transaction),
    );

    await expect(
      useCase.execute({
        id: RUN_ID,
        type: "counter",
        title: "Dzikir 33 kali",
        targetValue: targetValue(33),
        linkMode: "linked",
        habitId: HABIT_ID,
        occurrenceId: OCCURRENCE_ID,
      }),
    ).resolves.toEqual({ status: "rejected", code: "habit_unavailable" });
    expect(transaction.writes).toEqual([]);
  });
});
