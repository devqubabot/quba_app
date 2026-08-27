import { Instant, LocalDate, Weekday } from "../shared/time";
import {
  ConfigurationVersion,
  HabitId,
  OccurrenceId,
  ProgressValue,
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
