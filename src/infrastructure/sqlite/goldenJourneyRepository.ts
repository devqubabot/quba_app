import { ActivityEvent, ActivityRun } from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import { HabitStreak, XpLedgerEntry } from "../../domain/rewards/rewards";
import {
  ActivityEventId,
  ActivityRunId,
  HabitId,
  OccurrenceId,
} from "../../domain/shared/values";
import {
  decodeActivityEvent,
  decodeActivityRun,
  decodeHabit,
  decodeHabitStreak,
  decodeOccurrence,
  decodeXpLedgerEntry,
  ActivityEventRow,
  ActivityRunRow,
  encodeActivityEvent,
  encodeActivityRun,
  encodeHabit,
  encodeOccurrence,
  encodeXpLedgerEntry,
  HabitRow,
  OccurrenceRow,
  XpLedgerRow,
} from "./codecs";
import { SqliteExecutor, SqlitePersistenceError, SqliteRow } from "./database";

interface ExistenceRow extends SqliteRow {
  readonly present: unknown;
}

interface HabitStreakRow extends SqliteRow {
  readonly habit_id: unknown;
  readonly current_count: unknown;
}

interface StreakCompletionRow extends SqliteRow {
  readonly scheduled_date: unknown;
}

const HABIT_COLUMNS = `
  id, name, activity_type, target_value, active_days_json, enabled,
  archived_at, config_version
`;

const OCCURRENCE_COLUMNS = `
  id, habit_id, habit_config_version, activity_type, target_value,
  active_days_json, scheduled_date, status, completed_value, completed_at
`;

const ACTIVITY_RUN_COLUMNS = `
  id, activity_type, title, target_value, current_value, status, link_mode,
  habit_id, occurrence_id, started_at, completed_at
`;

const ACTIVITY_EVENT_COLUMNS = `
  event_id, activity_run_id, event_type, activity_type, progress_delta,
  habit_id, occurrence_id, source, started_at, recorded_at,
  device_time_offset_minutes
`;

const XP_LEDGER_COLUMNS = `
  ledger_id, habit_id, occurrence_id, activity_event_id, xp_delta, reason,
  created_at
`;

export class SqliteGoldenJourneyRepository {
  constructor(private readonly executor: SqliteExecutor) {}

  async hasProcessedEvent(eventId: ActivityEventId): Promise<boolean> {
    const row = await this.executor.getFirst<ExistenceRow>(
      "SELECT 1 AS present FROM processed_activity_events WHERE event_id = ? LIMIT 1;",
      [eventId],
    );
    return row !== null;
  }

  async getProcessedEvent(
    eventId: ActivityEventId,
  ): Promise<ActivityEvent | null> {
    const row = await this.executor.getFirst<ActivityEventRow>(
      `SELECT ${ACTIVITY_EVENT_COLUMNS} FROM processed_activity_events WHERE event_id = ?;`,
      [eventId],
    );
    return row === null ? null : decodeActivityEvent(row);
  }

  async getHabit(id: HabitId): Promise<Habit | null> {
    const row = await this.executor.getFirst<HabitRow>(
      `SELECT ${HABIT_COLUMNS} FROM habits WHERE id = ?;`,
      [id],
    );
    return row === null ? null : decodeHabit(row);
  }

  async getOccurrence(id: OccurrenceId): Promise<Occurrence | null> {
    const row = await this.executor.getFirst<OccurrenceRow>(
      `SELECT ${OCCURRENCE_COLUMNS} FROM occurrences WHERE id = ?;`,
      [id],
    );
    return row === null ? null : decodeOccurrence(row);
  }

  async getActivityRun(id: ActivityRunId): Promise<ActivityRun | null> {
    const row = await this.executor.getFirst<ActivityRunRow>(
      `SELECT ${ACTIVITY_RUN_COLUMNS} FROM activity_runs WHERE id = ?;`,
      [id],
    );
    return row === null ? null : decodeActivityRun(row);
  }

  async getXpLedgerEntryForOccurrence(
    id: OccurrenceId,
  ): Promise<XpLedgerEntry | null> {
    const row = await this.executor.getFirst<XpLedgerRow>(
      `SELECT ${XP_LEDGER_COLUMNS} FROM xp_ledger WHERE occurrence_id = ?;`,
      [id],
    );
    return row === null ? null : decodeXpLedgerEntry(row);
  }

  async getHabitStreak(id: HabitId): Promise<HabitStreak | null> {
    const row = await this.executor.getFirst<HabitStreakRow>(
      "SELECT habit_id, current_count FROM habit_streaks WHERE habit_id = ?;",
      [id],
    );
    if (row === null) {
      return null;
    }

    const completionRows = await this.executor.getAll<StreakCompletionRow>(
      `SELECT scheduled_date
       FROM habit_streak_completions
       WHERE habit_id = ?
       ORDER BY scheduled_date ASC;`,
      [id],
    );
    return decodeHabitStreak(row, completionRows);
  }

  async putHabit(habit: Habit): Promise<void> {
    await this.executor.run(
      `INSERT INTO habits (${HABIT_COLUMNS})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         activity_type = excluded.activity_type,
         target_value = excluded.target_value,
         active_days_json = excluded.active_days_json,
         enabled = excluded.enabled,
         archived_at = excluded.archived_at,
         config_version = excluded.config_version;`,
      encodeHabit(habit),
    );
  }

  async putOccurrence(occurrence: Occurrence): Promise<void> {
    await this.executor.run(
      `INSERT INTO occurrences (${OCCURRENCE_COLUMNS})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         habit_id = excluded.habit_id,
         habit_config_version = excluded.habit_config_version,
         activity_type = excluded.activity_type,
         target_value = excluded.target_value,
         active_days_json = excluded.active_days_json,
         scheduled_date = excluded.scheduled_date,
         status = excluded.status,
         completed_value = excluded.completed_value,
         completed_at = excluded.completed_at;`,
      encodeOccurrence(occurrence),
    );
  }

  async putActivityRun(run: ActivityRun): Promise<void> {
    await this.executor.run(
      `INSERT INTO activity_runs (${ACTIVITY_RUN_COLUMNS})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         activity_type = excluded.activity_type,
         title = excluded.title,
         target_value = excluded.target_value,
         current_value = excluded.current_value,
         status = excluded.status,
         link_mode = excluded.link_mode,
         habit_id = excluded.habit_id,
         occurrence_id = excluded.occurrence_id,
         started_at = excluded.started_at,
         completed_at = excluded.completed_at;`,
      encodeActivityRun(run),
    );
  }

  async updateActivityRun(run: ActivityRun): Promise<void> {
    const values = encodeActivityRun(run);
    const result = await this.executor.run(
      `UPDATE activity_runs SET
         activity_type = ?,
         title = ?,
         target_value = ?,
         current_value = ?,
         status = ?,
         link_mode = ?,
         habit_id = ?,
         occurrence_id = ?,
         started_at = ?,
         completed_at = ?
       WHERE id = ?;`,
      [...values.slice(1), values[0] ?? null],
    );
    assertUpdated(result.changes, "activity run", run.id);
  }

  async updateOccurrence(occurrence: Occurrence): Promise<void> {
    const values = encodeOccurrence(occurrence);
    const result = await this.executor.run(
      `UPDATE occurrences SET
         habit_id = ?,
         habit_config_version = ?,
         activity_type = ?,
         target_value = ?,
         active_days_json = ?,
         scheduled_date = ?,
         status = ?,
         completed_value = ?,
         completed_at = ?
       WHERE id = ?;`,
      [...values.slice(1), values[0] ?? null],
    );
    assertUpdated(result.changes, "occurrence", occurrence.id);
  }

  async insertProcessedEvent(event: ActivityEvent): Promise<void> {
    await this.executor.run(
      `INSERT INTO processed_activity_events (${ACTIVITY_EVENT_COLUMNS})
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      encodeActivityEvent(event),
    );
  }

  async insertXpLedgerEntry(entry: XpLedgerEntry): Promise<void> {
    await this.executor.run(
      `INSERT INTO xp_ledger (${XP_LEDGER_COLUMNS})
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      encodeXpLedgerEntry(entry),
    );
  }

  async putHabitStreak(streak: HabitStreak): Promise<void> {
    const uniqueDates = new Set(streak.completedScheduledDates);
    if (uniqueDates.size !== streak.completedScheduledDates.length) {
      throw new SqlitePersistenceError(
        "invalid_database_row",
        "Habit streak completion dates must be unique.",
      );
    }

    await this.executor.run(
      `INSERT INTO habit_streaks (habit_id, current_count)
       VALUES (?, ?)
       ON CONFLICT(habit_id) DO UPDATE SET current_count = excluded.current_count;`,
      [streak.habitId, streak.currentCount],
    );
    await this.executor.run(
      "DELETE FROM habit_streak_completions WHERE habit_id = ?;",
      [streak.habitId],
    );
    for (const scheduledDate of streak.completedScheduledDates) {
      await this.executor.run(
        `INSERT INTO habit_streak_completions (habit_id, scheduled_date)
         VALUES (?, ?);`,
        [streak.habitId, scheduledDate],
      );
    }
  }
}

function assertUpdated(changes: number, entity: string, id: string): void {
  if (changes !== 1) {
    throw new SqlitePersistenceError(
      "missing_persisted_entity",
      `Could not update ${entity} ${id} because it no longer exists.`,
    );
  }
}
