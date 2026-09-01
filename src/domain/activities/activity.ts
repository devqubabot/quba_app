import { ActivityType, Habit, Occurrence } from "../habits/habit";
import { Instant } from "../shared/time";
import {
  ActivityEventId,
  ActivityRunId,
  DeviceClockOffsetMinutes,
  HabitId,
  OccurrenceId,
  PositiveProgressDelta,
  ProgressValue,
  progressValue,
  TargetValue,
} from "../shared/values";

export type ActivityRunStatus =
  "draft" | "queued" | "active" | "paused" | "completed" | "cancelled";

interface ActivityRunBase {
  readonly id: ActivityRunId;
  readonly type: ActivityType;
  readonly title: string;
  readonly targetValue: TargetValue;
  readonly currentValue: ProgressValue;
  readonly status: ActivityRunStatus;
  readonly startedAt: Instant | null;
  readonly completedAt: Instant | null;
}

export interface LinkedActivityRun extends ActivityRunBase {
  readonly linkMode: "linked";
  readonly habitId: HabitId;
  readonly occurrenceId: OccurrenceId;
}

export interface StandaloneActivityRun extends ActivityRunBase {
  readonly linkMode: "standalone";
  readonly habitId: null;
  readonly occurrenceId: null;
}

export type ActivityRun = LinkedActivityRun | StandaloneActivityRun;

export type QuickActivityType = Exclude<ActivityType, "checklist">;

interface ActivityRunPreparationBase {
  readonly id: ActivityRunId;
  readonly type: QuickActivityType;
  readonly title: string;
  readonly targetValue: TargetValue;
  readonly existingActivityRun: ActivityRun | null;
}

export type ActivityRunPreparationInput =
  | (ActivityRunPreparationBase & {
      readonly linkMode: "linked";
      readonly habitId: HabitId;
      readonly occurrenceId: OccurrenceId;
      readonly habit: Habit | null;
      readonly occurrence: Occurrence | null;
    })
  | (ActivityRunPreparationBase & {
      readonly linkMode: "standalone";
    });

export type ActivityRunPreparationResult =
  | { readonly status: "created"; readonly activityRun: ActivityRun }
  | { readonly status: "unchanged"; readonly activityRun: ActivityRun }
  | {
      readonly status: "rejected";
      readonly code:
        | "invalid_title"
        | "activity_run_conflict"
        | "habit_unavailable"
        | "occurrence_unavailable"
        | "link_mismatch"
        | "activity_type_mismatch";
    };

export function prepareActivityRun(
  input: ActivityRunPreparationInput,
): ActivityRunPreparationResult {
  if (input.title.trim().length === 0) {
    return { status: "rejected", code: "invalid_title" };
  }

  if (input.existingActivityRun !== null) {
    return activityRunIdentityMatches(input.existingActivityRun, input)
      ? { status: "unchanged", activityRun: input.existingActivityRun }
      : { status: "rejected", code: "activity_run_conflict" };
  }

  if (input.linkMode === "standalone") {
    return {
      status: "created",
      activityRun: createActivityRun(input),
    };
  }

  if (
    input.habit === null ||
    !input.habit.enabled ||
    input.habit.archivedAt !== null
  ) {
    return { status: "rejected", code: "habit_unavailable" };
  }

  if (
    input.occurrence === null ||
    input.occurrence.status === "completed" ||
    input.occurrence.status === "skipped"
  ) {
    return { status: "rejected", code: "occurrence_unavailable" };
  }

  if (
    input.habit.id !== input.habitId ||
    input.occurrence.id !== input.occurrenceId ||
    input.occurrence.habitId !== input.habitId
  ) {
    return { status: "rejected", code: "link_mismatch" };
  }

  if (
    input.type !== input.habit.type ||
    input.type !== input.occurrence.activityType
  ) {
    return { status: "rejected", code: "activity_type_mismatch" };
  }

  return {
    status: "created",
    activityRun: createActivityRun(input),
  };
}

function createActivityRun(input: ActivityRunPreparationInput): ActivityRun {
  const base = {
    id: input.id,
    type: input.type,
    title: input.title.trim(),
    targetValue: input.targetValue,
    currentValue: progressValue(0),
    status: "draft" as const,
    startedAt: null,
    completedAt: null,
  };

  return input.linkMode === "linked"
    ? {
        ...base,
        linkMode: "linked",
        habitId: input.habitId,
        occurrenceId: input.occurrenceId,
      }
    : { ...base, linkMode: "standalone", habitId: null, occurrenceId: null };
}

function activityRunIdentityMatches(
  activityRun: ActivityRun,
  input: ActivityRunPreparationInput,
): boolean {
  return (
    activityRun.id === input.id &&
    activityRun.type === input.type &&
    activityRun.title === input.title.trim() &&
    activityRun.targetValue === input.targetValue &&
    activityRun.linkMode === input.linkMode &&
    (input.linkMode === "standalone" ||
      (activityRun.linkMode === "linked" &&
        activityRun.habitId === input.habitId &&
        activityRun.occurrenceId === input.occurrenceId))
  );
}

export interface ActivityEvent {
  readonly eventId: ActivityEventId;
  readonly activityRunId: ActivityRunId;
  readonly eventType: "progress_delta";
  readonly activityType: ActivityType;
  readonly progressDelta: PositiveProgressDelta;
  readonly habitId: HabitId | null;
  readonly occurrenceId: OccurrenceId | null;
  readonly source: "robot" | "app";
  readonly startedAt: Instant;
  readonly recordedAt: Instant;
  readonly deviceTimeOffsetMinutes: DeviceClockOffsetMinutes;
}
