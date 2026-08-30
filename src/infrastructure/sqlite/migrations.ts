import {
  QubaSqliteDatabase,
  SqliteExecutor,
  SqlitePersistenceError,
} from "./database";

interface SchemaVersionRow {
  readonly user_version: unknown;
  readonly [column: string]: unknown;
}

export interface SqliteMigration {
  readonly version: number;
  readonly statements: readonly string[];
}

export const CURRENT_DATABASE_VERSION = 2;

const CREATE_VERSION_ONE_SCHEMA = `
CREATE TABLE habits (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('checklist', 'counter', 'session')),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  active_days_json TEXT NOT NULL CHECK (json_valid(active_days_json) AND json_type(active_days_json) = 'array'),
  enabled INTEGER NOT NULL CHECK (enabled IN (0, 1)),
  archived_at TEXT,
  config_version INTEGER NOT NULL CHECK (config_version >= 0)
) STRICT;

CREATE TABLE occurrences (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  habit_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL CHECK (scheduled_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_value INTEGER NOT NULL CHECK (completed_value >= 0),
  completed_at TEXT,
  UNIQUE (id, habit_id),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

CREATE TRIGGER habits_validate_active_days_insert
BEFORE INSERT ON habits
WHEN
  EXISTS (
    SELECT 1 FROM json_each(NEW.active_days_json)
    WHERE type != 'integer' OR value NOT BETWEEN 0 AND 6
  ) OR
  (SELECT COUNT(*) FROM json_each(NEW.active_days_json)) !=
    (SELECT COUNT(DISTINCT value) FROM json_each(NEW.active_days_json))
BEGIN
  SELECT RAISE(ABORT, 'habit active_days_json must contain unique weekdays from 0 through 6');
END;

CREATE TRIGGER habits_validate_active_days_update
BEFORE UPDATE OF active_days_json ON habits
WHEN
  EXISTS (
    SELECT 1 FROM json_each(NEW.active_days_json)
    WHERE type != 'integer' OR value NOT BETWEEN 0 AND 6
  ) OR
  (SELECT COUNT(*) FROM json_each(NEW.active_days_json)) !=
    (SELECT COUNT(DISTINCT value) FROM json_each(NEW.active_days_json))
BEGIN
  SELECT RAISE(ABORT, 'habit active_days_json must contain unique weekdays from 0 through 6');
END;
`;

const UPGRADE_TO_VERSION_TWO = `
CREATE TABLE occurrences_v2 (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  habit_id TEXT NOT NULL,
  habit_config_version INTEGER NOT NULL CHECK (habit_config_version >= 0),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('checklist', 'counter', 'session')),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  active_days_json TEXT NOT NULL CHECK (json_valid(active_days_json) AND json_type(active_days_json) = 'array'),
  scheduled_date TEXT NOT NULL CHECK (scheduled_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_value INTEGER NOT NULL CHECK (completed_value >= 0),
  completed_at TEXT,
  UNIQUE (id, habit_id),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

INSERT INTO occurrences_v2 (
  id,
  habit_id,
  habit_config_version,
  activity_type,
  target_value,
  active_days_json,
  scheduled_date,
  status,
  completed_value,
  completed_at
)
SELECT
  occurrences.id,
  occurrences.habit_id,
  habits.config_version,
  habits.activity_type,
  habits.target_value,
  habits.active_days_json,
  occurrences.scheduled_date,
  occurrences.status,
  occurrences.completed_value,
  occurrences.completed_at
FROM occurrences
JOIN habits ON habits.id = occurrences.habit_id;

DROP TABLE occurrences;
ALTER TABLE occurrences_v2 RENAME TO occurrences;

CREATE TABLE activity_runs (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('checklist', 'counter', 'session')),
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  current_value INTEGER NOT NULL CHECK (current_value >= 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'queued', 'active', 'paused', 'completed', 'cancelled')),
  link_mode TEXT NOT NULL CHECK (link_mode IN ('linked', 'standalone')),
  habit_id TEXT,
  occurrence_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  CHECK (
    (link_mode = 'linked' AND habit_id IS NOT NULL AND occurrence_id IS NOT NULL) OR
    (link_mode = 'standalone' AND habit_id IS NULL AND occurrence_id IS NULL)
  ),
  UNIQUE (id, habit_id, occurrence_id),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (occurrence_id, habit_id) REFERENCES occurrences(id, habit_id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

CREATE TABLE processed_activity_events (
  event_id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(event_id)) > 0),
  activity_run_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type = 'progress_delta'),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('checklist', 'counter', 'session')),
  progress_delta INTEGER NOT NULL CHECK (progress_delta > 0),
  habit_id TEXT,
  occurrence_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('robot', 'app')),
  started_at TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  device_time_offset_minutes INTEGER NOT NULL CHECK (device_time_offset_minutes BETWEEN -1440 AND 1440),
  CHECK ((habit_id IS NULL AND occurrence_id IS NULL) OR (habit_id IS NOT NULL AND occurrence_id IS NOT NULL)),
  UNIQUE (event_id, habit_id, occurrence_id),
  FOREIGN KEY (activity_run_id) REFERENCES activity_runs(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (activity_run_id, habit_id, occurrence_id) REFERENCES activity_runs(id, habit_id, occurrence_id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

CREATE TABLE xp_ledger (
  ledger_id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(ledger_id)) > 0),
  habit_id TEXT NOT NULL,
  occurrence_id TEXT NOT NULL UNIQUE,
  activity_event_id TEXT NOT NULL UNIQUE,
  xp_delta INTEGER NOT NULL CHECK (xp_delta > 0),
  reason TEXT NOT NULL CHECK (reason = 'occurrence_completed'),
  created_at TEXT NOT NULL,
  FOREIGN KEY (occurrence_id, habit_id) REFERENCES occurrences(id, habit_id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  FOREIGN KEY (activity_event_id, habit_id, occurrence_id) REFERENCES processed_activity_events(event_id, habit_id, occurrence_id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

CREATE TABLE habit_streaks (
  habit_id TEXT PRIMARY KEY NOT NULL,
  current_count INTEGER NOT NULL CHECK (current_count >= 0),
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) STRICT;

CREATE TABLE habit_streak_completions (
  habit_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL CHECK (scheduled_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  PRIMARY KEY (habit_id, scheduled_date),
  FOREIGN KEY (habit_id) REFERENCES habit_streaks(habit_id) ON UPDATE RESTRICT ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_occurrences_habit_date ON occurrences(habit_id, scheduled_date);
CREATE INDEX idx_activity_runs_occurrence ON activity_runs(occurrence_id);
CREATE INDEX idx_events_activity_run ON processed_activity_events(activity_run_id);
CREATE INDEX idx_streak_completions_habit_date ON habit_streak_completions(habit_id, scheduled_date);

CREATE TRIGGER habits_reject_stale_update
BEFORE UPDATE ON habits
WHEN NEW.config_version < OLD.config_version
BEGIN
  SELECT RAISE(ABORT, 'habit config_version must be monotonic');
END;

CREATE TRIGGER habits_reject_same_version_conflict
BEFORE UPDATE ON habits
WHEN NEW.config_version = OLD.config_version AND (
  NEW.name IS NOT OLD.name OR
  NEW.activity_type IS NOT OLD.activity_type OR
  NEW.target_value IS NOT OLD.target_value OR
  NEW.active_days_json IS NOT OLD.active_days_json OR
  NEW.enabled IS NOT OLD.enabled OR
  NEW.archived_at IS NOT OLD.archived_at
)
BEGIN
  SELECT RAISE(ABORT, 'habit update conflicts at the same config_version');
END;

CREATE TRIGGER habits_reject_tombstone_removal
BEFORE UPDATE ON habits
WHEN OLD.archived_at IS NOT NULL AND NEW.archived_at IS NULL
BEGIN
  SELECT RAISE(ABORT, 'habit tombstone cannot be removed');
END;

CREATE TRIGGER occurrences_validate_active_days_insert
BEFORE INSERT ON occurrences
WHEN
  EXISTS (
    SELECT 1 FROM json_each(NEW.active_days_json)
    WHERE type != 'integer' OR value NOT BETWEEN 0 AND 6
  ) OR
  (SELECT COUNT(*) FROM json_each(NEW.active_days_json)) !=
    (SELECT COUNT(DISTINCT value) FROM json_each(NEW.active_days_json))
BEGIN
  SELECT RAISE(ABORT, 'occurrence active_days_json must contain unique weekdays from 0 through 6');
END;

CREATE TRIGGER occurrences_validate_active_days_update
BEFORE UPDATE OF active_days_json ON occurrences
WHEN
  EXISTS (
    SELECT 1 FROM json_each(NEW.active_days_json)
    WHERE type != 'integer' OR value NOT BETWEEN 0 AND 6
  ) OR
  (SELECT COUNT(*) FROM json_each(NEW.active_days_json)) !=
    (SELECT COUNT(DISTINCT value) FROM json_each(NEW.active_days_json))
BEGIN
  SELECT RAISE(ABORT, 'occurrence active_days_json must contain unique weekdays from 0 through 6');
END;

CREATE TRIGGER occurrences_reject_snapshot_update
BEFORE UPDATE ON occurrences
WHEN
  NEW.habit_id IS NOT OLD.habit_id OR
  NEW.habit_config_version IS NOT OLD.habit_config_version OR
  NEW.activity_type IS NOT OLD.activity_type OR
  NEW.target_value IS NOT OLD.target_value OR
  NEW.active_days_json IS NOT OLD.active_days_json OR
  NEW.scheduled_date IS NOT OLD.scheduled_date
BEGIN
  SELECT RAISE(ABORT, 'occurrence configuration snapshot is immutable');
END;

CREATE TRIGGER processed_activity_events_reject_update
BEFORE UPDATE ON processed_activity_events
BEGIN
  SELECT RAISE(ABORT, 'processed activity events are append-only');
END;

CREATE TRIGGER processed_activity_events_validate_run_link_insert
BEFORE INSERT ON processed_activity_events
WHEN NOT EXISTS (
  SELECT 1
  FROM activity_runs
  WHERE
    id = NEW.activity_run_id AND
    habit_id IS NEW.habit_id AND
    occurrence_id IS NEW.occurrence_id
)
BEGIN
  SELECT RAISE(ABORT, 'processed activity event link must match its activity run');
END;

CREATE TRIGGER processed_activity_events_reject_delete
BEFORE DELETE ON processed_activity_events
BEGIN
  SELECT RAISE(ABORT, 'processed activity events are append-only');
END;

CREATE TRIGGER xp_ledger_reject_update
BEFORE UPDATE ON xp_ledger
BEGIN
  SELECT RAISE(ABORT, 'XP ledger entries are append-only');
END;

CREATE TRIGGER xp_ledger_reject_delete
BEFORE DELETE ON xp_ledger
BEGIN
  SELECT RAISE(ABORT, 'XP ledger entries are append-only');
END;
`;

export const QUBA_DATABASE_MIGRATIONS: readonly SqliteMigration[] = [
  { version: 1, statements: [CREATE_VERSION_ONE_SCHEMA] },
  { version: 2, statements: [UPGRADE_TO_VERSION_TWO] },
];

export async function migrateQubaDatabase(
  database: QubaSqliteDatabase,
  migrations: readonly SqliteMigration[] = QUBA_DATABASE_MIGRATIONS,
): Promise<void> {
  await database.exec("PRAGMA foreign_keys = ON;");
  const currentVersion = await readSchemaVersion(database);
  const targetVersion = migrations.at(-1)?.version ?? 0;

  if (currentVersion > targetVersion) {
    throw new SqlitePersistenceError(
      "database_newer_than_app",
      `Database schema version ${currentVersion} is newer than supported version ${targetVersion}.`,
    );
  }

  for (const migration of migrations) {
    if (migration.version <= currentVersion) {
      continue;
    }

    await applyMigration(database, migration);
  }
}

async function applyMigration(
  database: QubaSqliteDatabase,
  migration: SqliteMigration,
): Promise<void> {
  await database.withExclusiveTransaction(async (transaction) => {
    for (const statement of migration.statements) {
      await transaction.exec(statement);
    }
    await transaction.exec(`PRAGMA user_version = ${migration.version};`);
  });
}

async function readSchemaVersion(executor: SqliteExecutor): Promise<number> {
  const row = await executor.getFirst<SchemaVersionRow>("PRAGMA user_version;");
  const version = row?.user_version;
  if (typeof version !== "number" || !Number.isSafeInteger(version)) {
    throw new SqlitePersistenceError(
      "invalid_database_row",
      "SQLite returned an invalid schema version.",
    );
  }
  return version;
}
