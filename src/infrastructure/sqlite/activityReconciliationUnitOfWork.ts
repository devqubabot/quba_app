import {
  ActivityReconciliationTransaction,
  ActivityReconciliationUnitOfWork,
} from "../../application/sync/reconcileActivityEvent";
import { ActivityEvent, ActivityRun } from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import { HabitStreak, XpLedgerEntry } from "../../domain/rewards/rewards";
import {
  ActivityEventId,
  ActivityRunId,
  HabitId,
  OccurrenceId,
} from "../../domain/shared/values";
import { QubaSqliteDatabase, SqliteExecutor } from "./database";
import { SqliteGoldenJourneyRepository } from "./goldenJourneyRepository";

class SqliteActivityReconciliationTransaction implements ActivityReconciliationTransaction {
  private readonly repository: SqliteGoldenJourneyRepository;

  constructor(executor: SqliteExecutor) {
    this.repository = new SqliteGoldenJourneyRepository(executor);
  }

  hasProcessedEvent(eventId: ActivityEventId): Promise<boolean> {
    return this.repository.hasProcessedEvent(eventId);
  }

  getActivityRun(id: ActivityRunId): Promise<ActivityRun | null> {
    return this.repository.getActivityRun(id);
  }

  getHabit(id: HabitId): Promise<Habit | null> {
    return this.repository.getHabit(id);
  }

  getOccurrence(id: OccurrenceId): Promise<Occurrence | null> {
    return this.repository.getOccurrence(id);
  }

  getXpLedgerEntryForOccurrence(
    id: OccurrenceId,
  ): Promise<XpLedgerEntry | null> {
    return this.repository.getXpLedgerEntryForOccurrence(id);
  }

  getHabitStreak(id: HabitId): Promise<HabitStreak | null> {
    return this.repository.getHabitStreak(id);
  }

  saveProcessedEvent(event: ActivityEvent): Promise<void> {
    return this.repository.insertProcessedEvent(event);
  }

  saveActivityRun(run: ActivityRun): Promise<void> {
    return this.repository.updateActivityRun(run);
  }

  saveOccurrence(occurrence: Occurrence): Promise<void> {
    return this.repository.updateOccurrence(occurrence);
  }

  appendXpLedgerEntry(entry: XpLedgerEntry): Promise<void> {
    return this.repository.insertXpLedgerEntry(entry);
  }

  saveHabitStreak(streak: HabitStreak): Promise<void> {
    return this.repository.putHabitStreak(streak);
  }
}

export class SqliteActivityReconciliationUnitOfWork implements ActivityReconciliationUnitOfWork {
  constructor(private readonly database: QubaSqliteDatabase) {}

  runInTransaction<Result>(
    operation: (
      transaction: ActivityReconciliationTransaction,
    ) => Promise<Result>,
  ): Promise<Result> {
    return this.database.withExclusiveTransaction((executor) =>
      operation(new SqliteActivityReconciliationTransaction(executor)),
    );
  }
}
