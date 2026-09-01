import {
  GoldenJourneySetupTransaction,
  GoldenJourneySetupUnitOfWork,
} from "../../application/goldenJourney/setupGoldenJourney";
import { ActivityRun } from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import {
  ActivityRunId,
  HabitId,
  OccurrenceId,
} from "../../domain/shared/values";
import { QubaSqliteDatabase, SqliteExecutor } from "./database";
import { SqliteGoldenJourneyRepository } from "./goldenJourneyRepository";

class SqliteGoldenJourneySetupTransaction implements GoldenJourneySetupTransaction {
  private readonly repository: SqliteGoldenJourneyRepository;

  constructor(executor: SqliteExecutor) {
    this.repository = new SqliteGoldenJourneyRepository(executor);
  }

  getHabit(id: HabitId): Promise<Habit | null> {
    return this.repository.getHabit(id);
  }

  getOccurrence(id: OccurrenceId): Promise<Occurrence | null> {
    return this.repository.getOccurrence(id);
  }

  getActivityRun(id: ActivityRunId): Promise<ActivityRun | null> {
    return this.repository.getActivityRun(id);
  }

  putHabit(habit: Habit): Promise<void> {
    return this.repository.putHabit(habit);
  }

  putOccurrence(occurrence: Occurrence): Promise<void> {
    return this.repository.putOccurrence(occurrence);
  }

  putActivityRun(activityRun: ActivityRun): Promise<void> {
    return this.repository.putActivityRun(activityRun);
  }
}

export class SqliteGoldenJourneySetupUnitOfWork implements GoldenJourneySetupUnitOfWork {
  constructor(private readonly database: QubaSqliteDatabase) {}

  runInTransaction<Result>(
    operation: (transaction: GoldenJourneySetupTransaction) => Promise<Result>,
  ): Promise<Result> {
    return this.database.withExclusiveTransaction((executor) =>
      operation(new SqliteGoldenJourneySetupTransaction(executor)),
    );
  }
}
