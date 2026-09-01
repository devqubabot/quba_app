import { Instant, LocalDate, Weekday, weekdayOf } from "../shared/time";
import {
  ConfigurationVersion,
  HabitId,
  OccurrenceId,
  ProgressValue,
  progressValue,
  TargetValue,
} from "../shared/values";

export type ActivityType = "checklist" | "counter" | "session";

export interface Habit {
  readonly id: HabitId;
  readonly name: string;
  readonly type: ActivityType;
  readonly targetValue: TargetValue;
  readonly activeDays: readonly Weekday[];
  readonly enabled: boolean;
  readonly archivedAt: Instant | null;
  readonly configVersion: ConfigurationVersion;
}

export type OccurrenceStatus =
  "pending" | "in_progress" | "completed" | "skipped";

export interface Occurrence {
  readonly id: OccurrenceId;
  readonly habitId: HabitId;
  readonly habitConfigVersion: ConfigurationVersion;
  readonly activityType: ActivityType;
  readonly targetValue: TargetValue;
  readonly activeDays: readonly Weekday[];
  readonly scheduledDate: LocalDate;
  readonly status: OccurrenceStatus;
  readonly completedValue: ProgressValue;
  readonly completedAt: Instant | null;
}

export type HabitConfigurationResult =
  | { readonly status: "applied"; readonly habit: Habit }
  | { readonly status: "unchanged"; readonly habit: Habit }
  | {
      readonly status: "rejected";
      readonly code:
        | "identity_mismatch"
        | "stale_version"
        | "same_version_conflict"
        | "tombstone_removal";
    };

export type OccurrencePreparationResult =
  | { readonly status: "created"; readonly occurrence: Occurrence }
  | { readonly status: "unchanged"; readonly occurrence: Occurrence }
  | {
      readonly status: "rejected";
      readonly code:
        "habit_unavailable" | "inactive_scheduled_date" | "occurrence_conflict";
    };

export interface OccurrencePreparationInput {
  readonly id: OccurrenceId;
  readonly habit: Habit;
  readonly scheduledDate: LocalDate;
  readonly existingOccurrence: Occurrence | null;
}

export function applyHabitConfiguration(
  current: Habit,
  proposed: Habit,
): HabitConfigurationResult {
  if (current.id !== proposed.id) {
    return { status: "rejected", code: "identity_mismatch" };
  }

  if (proposed.configVersion < current.configVersion) {
    return { status: "rejected", code: "stale_version" };
  }

  if (proposed.configVersion === current.configVersion) {
    return habitsEqual(current, proposed)
      ? { status: "unchanged", habit: current }
      : { status: "rejected", code: "same_version_conflict" };
  }

  if (current.archivedAt !== null && proposed.archivedAt === null) {
    return { status: "rejected", code: "tombstone_removal" };
  }

  return { status: "applied", habit: proposed };
}

export function prepareOccurrence(
  input: OccurrencePreparationInput,
): OccurrencePreparationResult {
  const { existingOccurrence, habit, id, scheduledDate } = input;

  if (!habit.enabled || habit.archivedAt !== null) {
    return { status: "rejected", code: "habit_unavailable" };
  }

  if (!habit.activeDays.includes(weekdayOf(scheduledDate))) {
    return { status: "rejected", code: "inactive_scheduled_date" };
  }

  if (existingOccurrence !== null) {
    return occurrenceSnapshotMatches(
      existingOccurrence,
      id,
      habit,
      scheduledDate,
    )
      ? { status: "unchanged", occurrence: existingOccurrence }
      : { status: "rejected", code: "occurrence_conflict" };
  }

  return {
    status: "created",
    occurrence: {
      id,
      habitId: habit.id,
      habitConfigVersion: habit.configVersion,
      activityType: habit.type,
      targetValue: habit.targetValue,
      activeDays: [...habit.activeDays],
      scheduledDate,
      status: "pending",
      completedValue: progressValue(0),
      completedAt: null,
    },
  };
}

function occurrenceSnapshotMatches(
  occurrence: Occurrence,
  id: OccurrenceId,
  habit: Habit,
  scheduledDate: LocalDate,
): boolean {
  return (
    occurrence.id === id &&
    occurrence.habitId === habit.id &&
    occurrence.habitConfigVersion === habit.configVersion &&
    occurrence.activityType === habit.type &&
    occurrence.targetValue === habit.targetValue &&
    occurrence.scheduledDate === scheduledDate &&
    occurrence.activeDays.length === habit.activeDays.length &&
    occurrence.activeDays.every((day, index) => day === habit.activeDays[index])
  );
}

function habitsEqual(left: Habit, right: Habit): boolean {
  return (
    left.id === right.id &&
    left.name === right.name &&
    left.type === right.type &&
    left.targetValue === right.targetValue &&
    left.enabled === right.enabled &&
    left.archivedAt === right.archivedAt &&
    left.configVersion === right.configVersion &&
    left.activeDays.length === right.activeDays.length &&
    left.activeDays.every((day, index) => day === right.activeDays[index])
  );
}
