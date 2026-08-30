import {
  activityEventId,
  configurationVersion,
  occurrenceId,
  targetValue,
  xpAmount,
  xpLedgerId,
} from "../../domain/shared/values";
import { SqlitePersistenceError, SqliteRow } from "./database";
import { SqliteGoldenJourneyRepository } from "./goldenJourneyRepository";
import {
  CURRENT_DATABASE_VERSION,
  migrateQubaDatabase,
  QUBA_DATABASE_MIGRATIONS,
} from "./migrations";
import {
  habitFixture,
  linkedEventFixture,
  linkedRunFixture,
  occurrenceFixture,
} from "./testing/fixtures";
import { NodeQubaSqliteDatabase } from "./testing/nodeSqliteDatabase";

interface VersionRow extends SqliteRow {
  readonly user_version: unknown;
}

interface ForeignKeysRow extends SqliteRow {
  readonly foreign_keys: unknown;
}

interface TableRow extends SqliteRow {
  readonly name: unknown;
}

interface SnapshotRow extends SqliteRow {
  readonly habit_config_version: unknown;
  readonly activity_type: unknown;
  readonly target_value: unknown;
  readonly active_days_json: unknown;
  readonly completed_value: unknown;
}

describe("Quba SQLite migrations", () => {
  it("creates the current schema on a fresh database and enables foreign keys", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await migrateQubaDatabase(database);

      const version = await database.getFirst<VersionRow>(
        "PRAGMA user_version;",
      );
      const foreignKeys = await database.getFirst<ForeignKeysRow>(
        "PRAGMA foreign_keys;",
      );
      const tables = await database.getAll<TableRow>(
        `SELECT name FROM sqlite_master
         WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
         ORDER BY name;`,
      );
      const foreignKeyViolations = await database.getAll(
        "PRAGMA foreign_key_check;",
      );

      expect(version?.user_version).toBe(CURRENT_DATABASE_VERSION);
      expect(foreignKeys?.foreign_keys).toBe(1);
      expect(tables.map((row) => row.name)).toEqual([
        "activity_runs",
        "habit_streak_completions",
        "habit_streaks",
        "habits",
        "occurrences",
        "processed_activity_events",
        "xp_ledger",
      ]);
      expect(foreignKeyViolations).toEqual([]);
    } finally {
      await database.close();
    }
  });

  it("upgrades representative version-one data and backfills occurrence snapshots", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      const versionOne = QUBA_DATABASE_MIGRATIONS.slice(0, 1);
      await migrateQubaDatabase(database, versionOne);
      await database.run(
        `INSERT INTO habits (
           id, name, activity_type, target_value, active_days_json, enabled,
           archived_at, config_version
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["habit-upgrade", "Reading", "session", 30, "[1,3,5]", 1, null, 7],
      );
      await database.run(
        `INSERT INTO occurrences (
           id, habit_id, scheduled_date, status, completed_value, completed_at
         ) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          "occurrence-upgrade",
          "habit-upgrade",
          "2026-08-28",
          "in_progress",
          15,
          null,
        ],
      );

      await migrateQubaDatabase(database);

      const snapshot = await database.getFirst<SnapshotRow>(
        `SELECT habit_config_version, activity_type, target_value,
                active_days_json, completed_value
         FROM occurrences WHERE id = ?;`,
        ["occurrence-upgrade"],
      );
      expect(snapshot).toEqual({
        habit_config_version: 7,
        activity_type: "session",
        target_value: 30,
        active_days_json: "[1,3,5]",
        completed_value: 15,
      });
    } finally {
      await database.close();
    }
  });

  it("rolls back a failed migration without advancing its version", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await expect(
        migrateQubaDatabase(database, [
          {
            version: 1,
            statements: [
              "CREATE TABLE stable_data (id TEXT PRIMARY KEY) STRICT;",
            ],
          },
          {
            version: 2,
            statements: [
              "CREATE TABLE partial_data (id TEXT PRIMARY KEY) STRICT;",
              "THIS IS NOT VALID SQL;",
            ],
          },
        ]),
      ).rejects.toThrow();

      const version = await database.getFirst<VersionRow>(
        "PRAGMA user_version;",
      );
      const partialTable = await database.getFirst<TableRow>(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'partial_data';",
      );
      expect(version?.user_version).toBe(1);
      expect(partialTable).toBeNull();
    } finally {
      await database.close();
    }
  });

  it("refuses to mutate a database created by a newer app version", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await database.exec(
        `CREATE TABLE future_data (id TEXT PRIMARY KEY) STRICT;
         PRAGMA user_version = 99;`,
      );

      await expect(migrateQubaDatabase(database)).rejects.toMatchObject({
        name: "SqlitePersistenceError",
        code: "database_newer_than_app",
      } satisfies Partial<SqlitePersistenceError>);
      expect(
        await database.getFirst<TableRow>(
          "SELECT name FROM sqlite_master WHERE name = 'future_data';",
        ),
      ).not.toBeNull();
    } finally {
      await database.close();
    }
  });

  it("enforces link, event-inbox, reward, and relationship constraints", async () => {
    const database = new NodeQubaSqliteDatabase();
    try {
      await migrateQubaDatabase(database);
      const repository = new SqliteGoldenJourneyRepository(database);
      const habit = habitFixture();
      const occurrence = occurrenceFixture();
      const run = linkedRunFixture();
      const event = linkedEventFixture();
      await repository.putHabit(habit);
      await repository.putOccurrence(occurrence);
      await repository.putActivityRun(run);

      await expect(
        database.run(
          `INSERT INTO habits (
             id, name, activity_type, target_value, active_days_json, enabled,
             archived_at, config_version
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          ["invalid-weekday", "Invalid", "counter", 1, "[7]", 1, null, 1],
        ),
      ).rejects.toThrow();
      await expect(
        database.run(
          "UPDATE habits SET active_days_json = ?, config_version = 4 WHERE id = ?;",
          ["[4,4]", habit.id],
        ),
      ).rejects.toThrow();
      await expect(
        database.run(
          `INSERT INTO occurrences (
             id, habit_id, habit_config_version, activity_type, target_value,
             active_days_json, scheduled_date, status, completed_value,
             completed_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            "invalid-occurrence-weekdays",
            habit.id,
            3,
            "counter",
            10,
            '["4"]',
            "2026-08-28",
            "pending",
            0,
            null,
          ],
        ),
      ).rejects.toThrow();
      await expect(
        repository.putOccurrence({
          ...occurrence,
          habitConfigVersion: configurationVersion(4),
          targetValue: targetValue(11),
        }),
      ).rejects.toThrow();
      expect(await repository.getOccurrence(occurrence.id)).toEqual(occurrence);

      await expect(
        database.run(
          `INSERT INTO activity_runs (
             id, activity_type, title, target_value, current_value, status,
             link_mode, habit_id, occurrence_id, started_at, completed_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            "invalid-standalone",
            "counter",
            "Invalid",
            1,
            0,
            "active",
            "standalone",
            habit.id,
            occurrence.id,
            null,
            null,
          ],
        ),
      ).rejects.toThrow();

      await expect(
        database.run(
          `INSERT INTO processed_activity_events (
             event_id, activity_run_id, event_type, activity_type,
             progress_delta, habit_id, occurrence_id, source, started_at,
             recorded_at, device_time_offset_minutes
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            "event-invalid-standalone-link",
            run.id,
            "progress_delta",
            run.type,
            1,
            null,
            null,
            "app",
            event.startedAt,
            event.recordedAt,
            0,
          ],
        ),
      ).rejects.toThrow(
        "processed activity event link must match its activity run",
      );

      await repository.insertProcessedEvent(event);
      await expect(repository.insertProcessedEvent(event)).rejects.toThrow();
      await expect(
        database.run(
          "UPDATE processed_activity_events SET progress_delta = 2 WHERE event_id = ?;",
          [event.eventId],
        ),
      ).rejects.toThrow();
      await expect(
        database.run(
          "DELETE FROM processed_activity_events WHERE event_id = ?;",
          [event.eventId],
        ),
      ).rejects.toThrow();

      await repository.insertXpLedgerEntry({
        ledgerId: xpLedgerId("ledger-first"),
        habitId: habit.id,
        occurrenceId: occurrence.id,
        activityEventId: event.eventId,
        xpDelta: xpAmount(10),
        reason: "occurrence_completed",
        createdAt: event.recordedAt,
      });
      await expect(
        database.run(
          "UPDATE xp_ledger SET xp_delta = 20 WHERE ledger_id = ?;",
          ["ledger-first"],
        ),
      ).rejects.toThrow();
      await expect(
        database.run("DELETE FROM xp_ledger WHERE ledger_id = ?;", [
          "ledger-first",
        ]),
      ).rejects.toThrow();

      const secondEvent = linkedEventFixture({
        eventId: activityEventId("event-second"),
      });
      await repository.insertProcessedEvent(secondEvent);
      await expect(
        repository.insertXpLedgerEntry({
          ledgerId: xpLedgerId("ledger-duplicate-occurrence"),
          habitId: habit.id,
          occurrenceId: occurrence.id,
          activityEventId: secondEvent.eventId,
          xpDelta: xpAmount(10),
          reason: "occurrence_completed",
          createdAt: secondEvent.recordedAt,
        }),
      ).rejects.toThrow();

      await expect(
        database.run("UPDATE habits SET config_version = 2 WHERE id = ?;", [
          habit.id,
        ]),
      ).rejects.toThrow();
      await expect(
        database.run("UPDATE habits SET name = 'Conflict' WHERE id = ?;", [
          habit.id,
        ]),
      ).rejects.toThrow();
      await database.run(
        "UPDATE habits SET archived_at = ?, config_version = 4 WHERE id = ?;",
        ["2026-08-27T00:03:00.000Z", habit.id],
      );
      await expect(
        database.run(
          "UPDATE habits SET archived_at = NULL, config_version = 5 WHERE id = ?;",
          [habit.id],
        ),
      ).rejects.toThrow();

      const otherOccurrence = occurrenceFixture({
        id: occurrenceId("occurrence-other"),
      });
      await repository.putOccurrence(otherOccurrence);
      await expect(
        repository.insertXpLedgerEntry({
          ledgerId: xpLedgerId("ledger-mismatched-event"),
          habitId: habit.id,
          occurrenceId: otherOccurrence.id,
          activityEventId: event.eventId,
          xpDelta: xpAmount(10),
          reason: "occurrence_completed",
          createdAt: event.recordedAt,
        }),
      ).rejects.toThrow();
    } finally {
      await database.close();
    }
  });
});
