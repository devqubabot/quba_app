import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ReconcileActivityEventUseCase } from "../../application/sync/reconcileActivityEvent";
import { ActivityEvent, ActivityRun } from "../../domain/activities/activity";
import { instant } from "../../domain/shared/time";
import {
  activityEventId,
  activityRunId,
  deviceClockOffsetMinutes,
  habitId,
  positiveProgressDelta,
  progressValue,
  targetValue,
} from "../../domain/shared/values";
import { SqliteActivityReconciliationUnitOfWork } from "./activityReconciliationUnitOfWork";
import {
  QubaSqliteDatabase,
  SqliteBindValue,
  SqliteExecutor,
  SqliteRow,
  SqliteRunResult,
} from "./database";
import { SqliteGoldenJourneyRepository } from "./goldenJourneyRepository";
import { migrateQubaDatabase } from "./migrations";
import {
  FIXTURE_EVENT_ID,
  FIXTURE_HABIT_ID,
  FIXTURE_OCCURRENCE_ID,
  FIXTURE_RUN_ID,
  habitFixture,
  linkedEventFixture,
  linkedRunFixture,
  occurrenceFixture,
} from "./testing/fixtures";
import { NodeQubaSqliteDatabase } from "./testing/nodeSqliteDatabase";

const RECONCILED_AT = instant("2026-08-27T00:02:00.000Z");

interface CountRow extends SqliteRow {
  readonly count: unknown;
}

describe("SQLite activity reconciliation", () => {
  it("commits a linked completion exactly once and recognizes it after reopen", async () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), "quba-sqlite-"));
    const filename = join(temporaryDirectory, "quba.db");
    let database: NodeQubaSqliteDatabase | null = null;

    try {
      database = new NodeQubaSqliteDatabase(filename);
      await migrateQubaDatabase(database);
      const repository = new SqliteGoldenJourneyRepository(database);
      await seedLinkedJourney(repository);
      const useCase = createUseCase(database);

      const applied = await useCase.execute(linkedEventFixture());
      expect(applied).toMatchObject({
        status: "applied",
        acknowledgeEvent: true,
        runCompleted: true,
        occurrenceCompleted: true,
      });
      expect(
        (await repository.getActivityRun(FIXTURE_RUN_ID))?.currentValue,
      ).toBe(10);
      expect(
        (await repository.getOccurrence(FIXTURE_OCCURRENCE_ID))?.status,
      ).toBe("completed");
      expect(
        (await repository.getXpLedgerEntryForOccurrence(FIXTURE_OCCURRENCE_ID))
          ?.xpDelta,
      ).toBe(10);
      expect(await repository.getHabitStreak(FIXTURE_HABIT_ID)).toMatchObject({
        currentCount: 1,
        completedScheduledDates: ["2026-08-27"],
      });

      await database.close();
      database = new NodeQubaSqliteDatabase(filename);
      await migrateQubaDatabase(database);
      const reopenedRepository = new SqliteGoldenJourneyRepository(database);
      const duplicate =
        await createUseCase(database).execute(linkedEventFixture());

      expect(duplicate).toEqual({
        status: "duplicate",
        acknowledgeEvent: true,
      });
      expect(await count(database, "processed_activity_events")).toBe(1);
      expect(await count(database, "xp_ledger")).toBe(1);
      expect(await count(database, "habit_streak_completions")).toBe(1);
      expect(
        (await reopenedRepository.getOccurrence(FIXTURE_OCCURRENCE_ID))
          ?.completedValue,
      ).toBe(10);
    } finally {
      await database?.close();
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it("rolls back every write when one reconciliation write fails, then retries safely", async () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), "quba-rollback-"));
    const filename = join(temporaryDirectory, "quba.db");
    let database = new NodeQubaSqliteDatabase(filename);
    try {
      await migrateQubaDatabase(database);
      let repository = new SqliteGoldenJourneyRepository(database);
      await seedLinkedJourney(repository);
      const failingDatabase = new FailOnceDatabase(
        database,
        "INSERT INTO xp_ledger",
      );

      const failed =
        await createUseCase(failingDatabase).execute(linkedEventFixture());
      expect(failed).toEqual({
        status: "failed",
        code: "transaction_failed",
        retryable: true,
        acknowledgeEvent: false,
      });

      await database.close();
      database = new NodeQubaSqliteDatabase(filename);
      await migrateQubaDatabase(database);
      repository = new SqliteGoldenJourneyRepository(database);
      expect(await repository.getProcessedEvent(FIXTURE_EVENT_ID)).toBeNull();
      expect(
        (await repository.getActivityRun(FIXTURE_RUN_ID))?.currentValue,
      ).toBe(0);
      expect(
        (await repository.getOccurrence(FIXTURE_OCCURRENCE_ID))?.completedValue,
      ).toBe(0);
      expect(
        await repository.getXpLedgerEntryForOccurrence(FIXTURE_OCCURRENCE_ID),
      ).toBeNull();
      expect(await repository.getHabitStreak(FIXTURE_HABIT_ID)).toBeNull();

      const retried =
        await createUseCase(database).execute(linkedEventFixture());
      expect(retried.status).toBe("applied");
      expect(await count(database, "processed_activity_events")).toBe(1);
      expect(await count(database, "xp_ledger")).toBe(1);
    } finally {
      await database.close();
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it("persists a standalone completion without occurrence, XP, or streak writes", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await migrateQubaDatabase(database);
      const repository = new SqliteGoldenJourneyRepository(database);
      const run: ActivityRun = {
        id: activityRunId("run-standalone"),
        type: "session",
        title: "Quiet reading",
        targetValue: targetValue(15),
        currentValue: progressValue(0),
        status: "active",
        linkMode: "standalone",
        habitId: null,
        occurrenceId: null,
        startedAt: instant("2026-08-27T01:00:00.000Z"),
        completedAt: null,
      };
      const event: ActivityEvent = {
        eventId: activityEventId("event-standalone"),
        activityRunId: run.id,
        eventType: "progress_delta",
        activityType: "session",
        progressDelta: positiveProgressDelta(15),
        habitId: null,
        occurrenceId: null,
        source: "app",
        startedAt: instant("2026-08-27T01:00:00.000Z"),
        recordedAt: instant("2026-08-27T01:15:00.000Z"),
        deviceTimeOffsetMinutes: deviceClockOffsetMinutes(420),
      };
      await repository.putActivityRun(run);

      const result = await createUseCase(database).execute(event);

      expect(result).toMatchObject({
        status: "applied",
        runCompleted: true,
        occurrenceCompleted: false,
      });
      expect((await repository.getActivityRun(run.id))?.status).toBe(
        "completed",
      );
      expect(await repository.getProcessedEvent(event.eventId)).toEqual(event);
      expect(await count(database, "occurrences")).toBe(0);
      expect(await count(database, "xp_ledger")).toBe(0);
      expect(await count(database, "habit_streaks")).toBe(0);
    } finally {
      await database.close();
    }
  });

  it("rejects corrupt persisted values instead of leaking them into the domain", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await migrateQubaDatabase(database);
      await database.run(
        `INSERT INTO habits (
           id, name, activity_type, target_value, active_days_json, enabled,
           archived_at, config_version
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          "corrupt-habit",
          "Corrupt",
          "counter",
          1,
          "[4]",
          1,
          "not-an-instant",
          1,
        ],
      );

      const repository = new SqliteGoldenJourneyRepository(database);
      await expect(repository.getHabit(habitFixture().id)).resolves.toBeNull();
      await expect(
        repository.getHabit(habitId("corrupt-habit")),
      ).rejects.toMatchObject({
        name: "SqlitePersistenceError",
        code: "invalid_database_row",
      });
    } finally {
      await database.close();
    }
  });
});

async function seedLinkedJourney(
  repository: SqliteGoldenJourneyRepository,
): Promise<void> {
  await repository.putHabit(habitFixture());
  await repository.putOccurrence(occurrenceFixture());
  await repository.putActivityRun(linkedRunFixture());
}

function createUseCase(
  database: QubaSqliteDatabase,
): ReconcileActivityEventUseCase {
  return new ReconcileActivityEventUseCase(
    new SqliteActivityReconciliationUnitOfWork(database),
    { now: () => RECONCILED_AT },
  );
}

async function count(
  database: QubaSqliteDatabase,
  table: string,
): Promise<number> {
  const allowedTables = new Set([
    "habit_streak_completions",
    "habit_streaks",
    "occurrences",
    "processed_activity_events",
    "xp_ledger",
  ]);
  if (!allowedTables.has(table)) {
    throw new Error(`Unsupported count table: ${table}`);
  }
  const row = await database.getFirst<CountRow>(
    `SELECT COUNT(*) AS count FROM ${table};`,
  );
  if (typeof row?.count !== "number") {
    throw new Error(`Invalid count for ${table}.`);
  }
  return row.count;
}

class FailOnceDatabase implements QubaSqliteDatabase {
  private failed = false;

  constructor(
    private readonly delegate: QubaSqliteDatabase,
    private readonly sqlFragment: string,
  ) {}

  exec(sql: string): Promise<void> {
    return this.delegate.exec(sql);
  }

  run(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<SqliteRunResult> {
    return this.delegate.run(sql, parameters);
  }

  getFirst<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<Row | null> {
    return this.delegate.getFirst<Row>(sql, parameters);
  }

  getAll<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<readonly Row[]> {
    return this.delegate.getAll<Row>(sql, parameters);
  }

  withExclusiveTransaction<Result>(
    operation: (transaction: SqliteExecutor) => Promise<Result>,
  ): Promise<Result> {
    return this.delegate.withExclusiveTransaction((transaction) =>
      operation(new FailOnceExecutor(transaction, this)),
    );
  }

  close(): Promise<void> {
    return this.delegate.close();
  }

  shouldFail(sql: string): boolean {
    if (!this.failed && sql.includes(this.sqlFragment)) {
      this.failed = true;
      return true;
    }
    return false;
  }
}

class FailOnceExecutor implements SqliteExecutor {
  constructor(
    private readonly delegate: SqliteExecutor,
    private readonly failure: FailOnceDatabase,
  ) {}

  exec(sql: string): Promise<void> {
    return this.delegate.exec(sql);
  }

  run(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<SqliteRunResult> {
    if (this.failure.shouldFail(sql)) {
      throw new Error("Injected XP-ledger write failure.");
    }
    return this.delegate.run(sql, parameters);
  }

  getFirst<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<Row | null> {
    return this.delegate.getFirst<Row>(sql, parameters);
  }

  getAll<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<readonly Row[]> {
    return this.delegate.getAll<Row>(sql, parameters);
  }
}
