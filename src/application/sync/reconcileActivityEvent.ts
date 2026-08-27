import { ActivityEvent, ActivityRun } from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import { HabitStreak, XpLedgerEntry } from "../../domain/rewards/rewards";
import { Instant } from "../../domain/shared/time";
import {
  ActivityEventId,
  ActivityRunId,
  HabitId,
  OccurrenceId,
} from "../../domain/shared/values";
import {
  ActivityEventReconciliationResult,
  reconcileActivityEvent,
} from "../../domain/sync/reconcileActivityEvent";

export interface ActivityReconciliationTransaction {
  hasProcessedEvent(eventId: ActivityEventId): Promise<boolean>;
  getActivityRun(id: ActivityRunId): Promise<ActivityRun | null>;
  getHabit(id: HabitId): Promise<Habit | null>;
  getOccurrence(id: OccurrenceId): Promise<Occurrence | null>;
  getXpLedgerEntryForOccurrence(
    id: OccurrenceId,
  ): Promise<XpLedgerEntry | null>;
  getHabitStreak(id: HabitId): Promise<HabitStreak | null>;
  saveProcessedEvent(event: ActivityEvent): Promise<void>;
  saveActivityRun(run: ActivityRun): Promise<void>;
  saveOccurrence(occurrence: Occurrence): Promise<void>;
  appendXpLedgerEntry(entry: XpLedgerEntry): Promise<void>;
  saveHabitStreak(streak: HabitStreak): Promise<void>;
}

export interface ActivityReconciliationUnitOfWork {
  /**
   * The callback and every write it performs must commit atomically. Implementations
   * must also enforce `event_id` uniqueness so concurrent delivery remains idempotent.
   */
  runInTransaction<Result>(
    operation: (
      transaction: ActivityReconciliationTransaction,
    ) => Promise<Result>,
  ): Promise<Result>;
}

export interface ReconciliationClock {
  now(): Instant;
}

export type ReconcileActivityEventOutcome =
  | ActivityEventReconciliationResult
  | {
      readonly status: "failed";
      readonly code: "transaction_failed";
      readonly retryable: true;
      readonly acknowledgeEvent: false;
    };

export class ReconcileActivityEventUseCase {
  constructor(
    private readonly unitOfWork: ActivityReconciliationUnitOfWork,
    private readonly clock: ReconciliationClock,
  ) {}

  async execute(event: ActivityEvent): Promise<ReconcileActivityEventOutcome> {
    try {
      return await this.unitOfWork.runInTransaction(async (transaction) => {
        const eventAlreadyProcessed = await transaction.hasProcessedEvent(
          event.eventId,
        );

        if (eventAlreadyProcessed) {
          return reconcileActivityEvent(event, {
            eventAlreadyProcessed: true,
            activityRun: null,
            habit: null,
            occurrence: null,
            existingXpLedgerEntry: null,
            streak: null,
            reconciledAt: this.clock.now(),
          });
        }

        const activityRun = await transaction.getActivityRun(
          event.activityRunId,
        );
        const linkedRun =
          activityRun?.linkMode === "linked" ? activityRun : null;
        const habit =
          linkedRun === null
            ? null
            : await transaction.getHabit(linkedRun.habitId);
        const occurrence =
          linkedRun === null
            ? null
            : await transaction.getOccurrence(linkedRun.occurrenceId);
        const existingXpLedgerEntry =
          linkedRun === null
            ? null
            : await transaction.getXpLedgerEntryForOccurrence(
                linkedRun.occurrenceId,
              );
        const streak =
          linkedRun === null
            ? null
            : await transaction.getHabitStreak(linkedRun.habitId);
        const result = reconcileActivityEvent(event, {
          eventAlreadyProcessed: false,
          activityRun,
          habit,
          occurrence,
          existingXpLedgerEntry,
          streak,
          reconciledAt: this.clock.now(),
        });

        if (result.status !== "applied") {
          return result;
        }

        await transaction.saveProcessedEvent(result.processedEvent);
        await transaction.saveActivityRun(result.activityRun);

        if (result.occurrence !== null) {
          await transaction.saveOccurrence(result.occurrence);
        }
        if (result.xpLedgerEntry !== null) {
          await transaction.appendXpLedgerEntry(result.xpLedgerEntry);
        }
        if (result.streak !== null) {
          await transaction.saveHabitStreak(result.streak);
        }

        return result;
      });
    } catch {
      return {
        status: "failed",
        code: "transaction_failed",
        retryable: true,
        acknowledgeEvent: false,
      };
    }
  }
}
