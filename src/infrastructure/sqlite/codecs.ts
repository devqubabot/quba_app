import {
  ActivityEvent,
  ActivityRun,
  ActivityRunStatus,
} from "../../domain/activities/activity";
import {
  ActivityType,
  Habit,
  Occurrence,
  OccurrenceStatus,
} from "../../domain/habits/habit";
import { HabitStreak, XpLedgerEntry } from "../../domain/rewards/rewards";
import { instant, localDate, Weekday } from "../../domain/shared/time";
import {
  activityEventId,
  activityRunId,
  configurationVersion,
  deviceClockOffsetMinutes,
  habitId,
  occurrenceId,
  positiveProgressDelta,
  progressValue,
  targetValue,
  xpAmount,
  xpLedgerId,
} from "../../domain/shared/values";
import { SqliteBindValue, SqlitePersistenceError, SqliteRow } from "./database";

export interface HabitRow extends SqliteRow {
  readonly id: unknown;
  readonly name: unknown;
  readonly activity_type: unknown;
  readonly target_value: unknown;
  readonly active_days_json: unknown;
  readonly enabled: unknown;
  readonly archived_at: unknown;
  readonly config_version: unknown;
}

export interface OccurrenceRow extends SqliteRow {
  readonly id: unknown;
  readonly habit_id: unknown;
  readonly habit_config_version: unknown;
  readonly activity_type: unknown;
  readonly target_value: unknown;
  readonly active_days_json: unknown;
  readonly scheduled_date: unknown;
  readonly status: unknown;
  readonly completed_value: unknown;
  readonly completed_at: unknown;
}

export interface ActivityRunRow extends SqliteRow {
  readonly id: unknown;
  readonly activity_type: unknown;
  readonly title: unknown;
  readonly target_value: unknown;
  readonly current_value: unknown;
  readonly status: unknown;
  readonly link_mode: unknown;
  readonly habit_id: unknown;
  readonly occurrence_id: unknown;
  readonly started_at: unknown;
  readonly completed_at: unknown;
}

export interface ActivityEventRow extends SqliteRow {
  readonly event_id: unknown;
  readonly activity_run_id: unknown;
  readonly event_type: unknown;
  readonly activity_type: unknown;
  readonly progress_delta: unknown;
  readonly habit_id: unknown;
  readonly occurrence_id: unknown;
  readonly source: unknown;
  readonly started_at: unknown;
  readonly recorded_at: unknown;
  readonly device_time_offset_minutes: unknown;
}

export interface XpLedgerRow extends SqliteRow {
  readonly ledger_id: unknown;
  readonly habit_id: unknown;
  readonly occurrence_id: unknown;
  readonly activity_event_id: unknown;
  readonly xp_delta: unknown;
  readonly reason: unknown;
  readonly created_at: unknown;
}

interface HabitStreakRow extends SqliteRow {
  readonly habit_id: unknown;
  readonly current_count: unknown;
}

interface StreakCompletionRow extends SqliteRow {
  readonly scheduled_date: unknown;
}

export function decodeHabit(row: HabitRow): Habit {
  return decode("habit", () => ({
    id: habitId(requiredString(row.id, "habits.id")),
    name: requiredString(row.name, "habits.name"),
    type: activityType(row.activity_type),
    targetValue: targetValue(
      requiredNumber(row.target_value, "habits.target_value"),
    ),
    activeDays: activeDays(row.active_days_json),
    enabled: sqliteBoolean(row.enabled, "habits.enabled"),
    archivedAt:
      row.archived_at === null
        ? null
        : instant(requiredString(row.archived_at, "habits.archived_at")),
    configVersion: configurationVersion(
      requiredNumber(row.config_version, "habits.config_version"),
    ),
  }));
}

export function encodeHabit(habit: Habit): readonly SqliteBindValue[] {
  return [
    habit.id,
    habit.name,
    habit.type,
    habit.targetValue,
    JSON.stringify(validateActiveDays(habit.activeDays)),
    habit.enabled ? 1 : 0,
    habit.archivedAt,
    habit.configVersion,
  ];
}

export function decodeOccurrence(row: OccurrenceRow): Occurrence {
  return decode("occurrence", () => ({
    id: occurrenceId(requiredString(row.id, "occurrences.id")),
    habitId: habitId(requiredString(row.habit_id, "occurrences.habit_id")),
    habitConfigVersion: configurationVersion(
      requiredNumber(
        row.habit_config_version,
        "occurrences.habit_config_version",
      ),
    ),
    activityType: activityType(row.activity_type),
    targetValue: targetValue(
      requiredNumber(row.target_value, "occurrences.target_value"),
    ),
    activeDays: activeDays(row.active_days_json),
    scheduledDate: localDate(
      requiredString(row.scheduled_date, "occurrences.scheduled_date"),
    ),
    status: occurrenceStatus(row.status),
    completedValue: progressValue(
      requiredNumber(row.completed_value, "occurrences.completed_value"),
    ),
    completedAt:
      row.completed_at === null
        ? null
        : instant(requiredString(row.completed_at, "occurrences.completed_at")),
  }));
}

export function encodeOccurrence(
  occurrence: Occurrence,
): readonly SqliteBindValue[] {
  return [
    occurrence.id,
    occurrence.habitId,
    occurrence.habitConfigVersion,
    occurrence.activityType,
    occurrence.targetValue,
    JSON.stringify(validateActiveDays(occurrence.activeDays)),
    occurrence.scheduledDate,
    occurrence.status,
    occurrence.completedValue,
    occurrence.completedAt,
  ];
}

export function decodeActivityRun(row: ActivityRunRow): ActivityRun {
  return decode("activity run", () => {
    const common = {
      id: activityRunId(requiredString(row.id, "activity_runs.id")),
      type: activityType(row.activity_type),
      title: requiredString(row.title, "activity_runs.title"),
      targetValue: targetValue(
        requiredNumber(row.target_value, "activity_runs.target_value"),
      ),
      currentValue: progressValue(
        requiredNumber(row.current_value, "activity_runs.current_value"),
      ),
      status: activityRunStatus(row.status),
      startedAt:
        row.started_at === null
          ? null
          : instant(requiredString(row.started_at, "activity_runs.started_at")),
      completedAt:
        row.completed_at === null
          ? null
          : instant(
              requiredString(row.completed_at, "activity_runs.completed_at"),
            ),
    } as const;

    if (row.link_mode === "linked") {
      return {
        ...common,
        linkMode: "linked",
        habitId: habitId(
          requiredString(row.habit_id, "activity_runs.habit_id"),
        ),
        occurrenceId: occurrenceId(
          requiredString(row.occurrence_id, "activity_runs.occurrence_id"),
        ),
      };
    }

    if (
      row.link_mode === "standalone" &&
      row.habit_id === null &&
      row.occurrence_id === null
    ) {
      return {
        ...common,
        linkMode: "standalone",
        habitId: null,
        occurrenceId: null,
      };
    }

    throw invalidColumn("activity_runs.link_mode");
  });
}

export function encodeActivityRun(
  run: ActivityRun,
): readonly SqliteBindValue[] {
  return [
    run.id,
    run.type,
    run.title,
    run.targetValue,
    run.currentValue,
    run.status,
    run.linkMode,
    run.habitId,
    run.occurrenceId,
    run.startedAt,
    run.completedAt,
  ];
}

export function decodeActivityEvent(row: ActivityEventRow): ActivityEvent {
  return decode("activity event", () => {
    if (row.event_type !== "progress_delta") {
      throw invalidColumn("processed_activity_events.event_type");
    }
    if (row.source !== "robot" && row.source !== "app") {
      throw invalidColumn("processed_activity_events.source");
    }

    const persistedHabitId = nullableString(
      row.habit_id,
      "processed_activity_events.habit_id",
    );
    const persistedOccurrenceId = nullableString(
      row.occurrence_id,
      "processed_activity_events.occurrence_id",
    );

    return {
      eventId: activityEventId(
        requiredString(row.event_id, "processed_activity_events.event_id"),
      ),
      activityRunId: activityRunId(
        requiredString(
          row.activity_run_id,
          "processed_activity_events.activity_run_id",
        ),
      ),
      eventType: "progress_delta",
      activityType: activityType(row.activity_type),
      progressDelta: positiveProgressDelta(
        requiredNumber(
          row.progress_delta,
          "processed_activity_events.progress_delta",
        ),
      ),
      habitId: persistedHabitId === null ? null : habitId(persistedHabitId),
      occurrenceId:
        persistedOccurrenceId === null
          ? null
          : occurrenceId(persistedOccurrenceId),
      source: row.source,
      startedAt: instant(
        requiredString(row.started_at, "processed_activity_events.started_at"),
      ),
      recordedAt: instant(
        requiredString(
          row.recorded_at,
          "processed_activity_events.recorded_at",
        ),
      ),
      deviceTimeOffsetMinutes: deviceClockOffsetMinutes(
        requiredNumber(
          row.device_time_offset_minutes,
          "processed_activity_events.device_time_offset_minutes",
        ),
      ),
    };
  });
}

export function encodeActivityEvent(
  event: ActivityEvent,
): readonly SqliteBindValue[] {
  return [
    event.eventId,
    event.activityRunId,
    event.eventType,
    event.activityType,
    event.progressDelta,
    event.habitId,
    event.occurrenceId,
    event.source,
    event.startedAt,
    event.recordedAt,
    event.deviceTimeOffsetMinutes,
  ];
}

export function decodeXpLedgerEntry(row: XpLedgerRow): XpLedgerEntry {
  return decode("XP ledger entry", () => {
    if (row.reason !== "occurrence_completed") {
      throw invalidColumn("xp_ledger.reason");
    }

    return {
      ledgerId: xpLedgerId(
        requiredString(row.ledger_id, "xp_ledger.ledger_id"),
      ),
      habitId: habitId(requiredString(row.habit_id, "xp_ledger.habit_id")),
      occurrenceId: occurrenceId(
        requiredString(row.occurrence_id, "xp_ledger.occurrence_id"),
      ),
      activityEventId: activityEventId(
        requiredString(row.activity_event_id, "xp_ledger.activity_event_id"),
      ),
      xpDelta: xpAmount(requiredNumber(row.xp_delta, "xp_ledger.xp_delta")),
      reason: "occurrence_completed",
      createdAt: instant(
        requiredString(row.created_at, "xp_ledger.created_at"),
      ),
    };
  });
}

export function encodeXpLedgerEntry(
  entry: XpLedgerEntry,
): readonly SqliteBindValue[] {
  return [
    entry.ledgerId,
    entry.habitId,
    entry.occurrenceId,
    entry.activityEventId,
    entry.xpDelta,
    entry.reason,
    entry.createdAt,
  ];
}

export function decodeHabitStreak(
  row: HabitStreakRow,
  completionRows: readonly StreakCompletionRow[],
): HabitStreak {
  return decode("habit streak", () => ({
    habitId: habitId(requiredString(row.habit_id, "habit_streaks.habit_id")),
    currentCount: nonNegativeInteger(
      row.current_count,
      "habit_streaks.current_count",
    ),
    completedScheduledDates: completionRows.map((completion) =>
      localDate(
        requiredString(
          completion.scheduled_date,
          "habit_streak_completions.scheduled_date",
        ),
      ),
    ),
  }));
}

function decode<Result>(label: string, operation: () => Result): Result {
  try {
    return operation();
  } catch (error: unknown) {
    if (error instanceof SqlitePersistenceError) {
      throw error;
    }
    throw new SqlitePersistenceError(
      "invalid_database_row",
      `Could not decode persisted ${label}.`,
      { cause: error },
    );
  }
}

function requiredString(value: unknown, column: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw invalidColumn(column);
  }
  return value;
}

function nullableString(value: unknown, column: string): string | null {
  if (value === null) {
    return null;
  }
  return requiredString(value, column);
}

function requiredNumber(value: unknown, column: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw invalidColumn(column);
  }
  return value;
}

function nonNegativeInteger(value: unknown, column: string): number {
  const number = requiredNumber(value, column);
  if (number < 0) {
    throw invalidColumn(column);
  }
  return number;
}

function sqliteBoolean(value: unknown, column: string): boolean {
  if (value === 0) {
    return false;
  }
  if (value === 1) {
    return true;
  }
  throw invalidColumn(column);
}

function activityType(value: unknown): ActivityType {
  if (value === "checklist" || value === "counter" || value === "session") {
    return value;
  }
  throw invalidColumn("activity_type");
}

function activityRunStatus(value: unknown): ActivityRunStatus {
  if (
    value === "draft" ||
    value === "queued" ||
    value === "active" ||
    value === "paused" ||
    value === "completed" ||
    value === "cancelled"
  ) {
    return value;
  }
  throw invalidColumn("activity_runs.status");
}

function occurrenceStatus(value: unknown): OccurrenceStatus {
  if (
    value === "pending" ||
    value === "in_progress" ||
    value === "completed" ||
    value === "skipped"
  ) {
    return value;
  }
  throw invalidColumn("occurrences.status");
}

function activeDays(value: unknown): readonly Weekday[] {
  if (typeof value !== "string") {
    throw invalidColumn("active_days_json");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (error: unknown) {
    throw new SqlitePersistenceError(
      "invalid_database_row",
      "active_days_json must contain valid JSON.",
      { cause: error },
    );
  }

  if (!Array.isArray(parsed)) {
    throw invalidColumn("active_days_json");
  }
  return validateActiveDays(parsed);
}

function validateActiveDays(values: readonly unknown[]): readonly Weekday[] {
  const days: Weekday[] = [];
  const uniqueDays = new Set<number>();

  for (const value of values) {
    if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 6) {
      throw invalidColumn("active_days_json");
    }
    if (uniqueDays.has(Number(value))) {
      throw invalidColumn("active_days_json");
    }
    uniqueDays.add(Number(value));
    days.push(value as Weekday);
  }

  return days;
}

function invalidColumn(column: string): SqlitePersistenceError {
  return new SqlitePersistenceError(
    "invalid_database_row",
    `Persisted column ${column} has an invalid value.`,
  );
}
