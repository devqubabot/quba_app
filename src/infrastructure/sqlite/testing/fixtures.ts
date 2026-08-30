import {
  ActivityEvent,
  ActivityRun,
} from "../../../domain/activities/activity";
import { Habit, Occurrence } from "../../../domain/habits/habit";
import { instant, localDate } from "../../../domain/shared/time";
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
} from "../../../domain/shared/values";

export const FIXTURE_HABIT_ID = habitId("habit-dhikr");
export const FIXTURE_OCCURRENCE_ID = occurrenceId("occurrence-2026-08-27");
export const FIXTURE_RUN_ID = activityRunId("run-linked");
export const FIXTURE_EVENT_ID = activityEventId("event-linked-completion");

export function habitFixture(overrides: Partial<Habit> = {}): Habit {
  return {
    id: FIXTURE_HABIT_ID,
    name: "Morning dhikr",
    type: "counter",
    targetValue: targetValue(10),
    activeDays: [4],
    enabled: true,
    archivedAt: null,
    configVersion: configurationVersion(3),
    ...overrides,
  };
}

export function occurrenceFixture(
  overrides: Partial<Occurrence> = {},
): Occurrence {
  return {
    id: FIXTURE_OCCURRENCE_ID,
    habitId: FIXTURE_HABIT_ID,
    habitConfigVersion: configurationVersion(3),
    activityType: "counter",
    targetValue: targetValue(10),
    activeDays: [4],
    scheduledDate: localDate("2026-08-27"),
    status: "pending",
    completedValue: progressValue(0),
    completedAt: null,
    ...overrides,
  };
}

export function linkedRunFixture(
  overrides: Partial<ActivityRun> = {},
): ActivityRun {
  return {
    id: FIXTURE_RUN_ID,
    type: "counter",
    title: "Morning dhikr",
    targetValue: targetValue(10),
    currentValue: progressValue(0),
    status: "active",
    linkMode: "linked",
    habitId: FIXTURE_HABIT_ID,
    occurrenceId: FIXTURE_OCCURRENCE_ID,
    startedAt: instant("2026-08-27T00:00:00.000Z"),
    completedAt: null,
    ...overrides,
  } as ActivityRun;
}

export function linkedEventFixture(
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  return {
    eventId: FIXTURE_EVENT_ID,
    activityRunId: FIXTURE_RUN_ID,
    eventType: "progress_delta",
    activityType: "counter",
    progressDelta: positiveProgressDelta(10),
    habitId: FIXTURE_HABIT_ID,
    occurrenceId: FIXTURE_OCCURRENCE_ID,
    source: "robot",
    startedAt: instant("2026-08-27T00:00:00.000Z"),
    recordedAt: instant("2026-08-27T00:01:00.000Z"),
    deviceTimeOffsetMinutes: deviceClockOffsetMinutes(0),
    ...overrides,
  };
}
