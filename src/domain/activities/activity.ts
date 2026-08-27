import { ActivityType } from "../habits/habit";
import { Instant } from "../shared/time";
import {
  ActivityEventId,
  ActivityRunId,
  DeviceClockOffsetMinutes,
  HabitId,
  OccurrenceId,
  PositiveProgressDelta,
  ProgressValue,
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
