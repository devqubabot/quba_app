import { instant, localDate } from "../shared/time";
import {
  configurationVersion,
  habitId,
  occurrenceId,
  progressValue,
  targetValue,
} from "../shared/values";
import {
  applyHabitConfiguration,
  Habit,
  Occurrence,
  prepareOccurrence,
} from "./habit";

const current: Habit = {
  id: habitId("habit-dzikir"),
  name: "Dzikir",
  type: "counter",
  targetValue: targetValue(33),
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  enabled: true,
  archivedAt: null,
  configVersion: configurationVersion(3),
};

describe("applyHabitConfiguration", () => {
  it("applies only a newer configuration version", () => {
    const proposed = {
      ...current,
      name: "Dzikir pagi",
      configVersion: configurationVersion(4),
    };

    expect(applyHabitConfiguration(current, proposed)).toEqual({
      status: "applied",
      habit: proposed,
    });
    expect(
      applyHabitConfiguration(current, {
        ...proposed,
        configVersion: configurationVersion(2),
      }),
    ).toEqual({ status: "rejected", code: "stale_version" });
  });

  it("distinguishes an identical retry from a same-version conflict", () => {
    expect(applyHabitConfiguration(current, { ...current })).toEqual({
      status: "unchanged",
      habit: current,
    });
    expect(
      applyHabitConfiguration(current, { ...current, name: "Changed" }),
    ).toEqual({ status: "rejected", code: "same_version_conflict" });
  });

  it("does not remove an archive tombstone through a later version", () => {
    const archived: Habit = {
      ...current,
      archivedAt: instant("2026-08-26T10:00:00.000Z"),
    };

    expect(
      applyHabitConfiguration(archived, {
        ...archived,
        archivedAt: null,
        configVersion: configurationVersion(4),
      }),
    ).toEqual({ status: "rejected", code: "tombstone_removal" });
  });
});

describe("prepareOccurrence", () => {
  const id = occurrenceId("occurrence-2026-08-31");
  const scheduledDate = localDate("2026-08-31");

  it("snapshots the completion rules from the habit", () => {
    expect(
      prepareOccurrence({
        id,
        habit: current,
        scheduledDate,
        existingOccurrence: null,
      }),
    ).toEqual({
      status: "created",
      occurrence: {
        id,
        habitId: current.id,
        habitConfigVersion: current.configVersion,
        activityType: current.type,
        targetValue: current.targetValue,
        activeDays: current.activeDays,
        scheduledDate,
        status: "pending",
        completedValue: progressValue(0),
        completedAt: null,
      },
    });
  });

  it("rejects unavailable habits and dates outside the schedule", () => {
    expect(
      prepareOccurrence({
        id,
        habit: { ...current, enabled: false },
        scheduledDate,
        existingOccurrence: null,
      }),
    ).toEqual({ status: "rejected", code: "habit_unavailable" });
    expect(
      prepareOccurrence({
        id,
        habit: {
          ...current,
          archivedAt: instant("2026-08-30T00:00:00.000Z"),
        },
        scheduledDate,
        existingOccurrence: null,
      }),
    ).toEqual({ status: "rejected", code: "habit_unavailable" });
    expect(
      prepareOccurrence({
        id,
        habit: { ...current, activeDays: [2] },
        scheduledDate,
        existingOccurrence: null,
      }),
    ).toEqual({ status: "rejected", code: "inactive_scheduled_date" });
  });

  it("preserves mutable progress on an identical setup retry", () => {
    const existingOccurrence: Occurrence = {
      id,
      habitId: current.id,
      habitConfigVersion: current.configVersion,
      activityType: current.type,
      targetValue: current.targetValue,
      activeDays: current.activeDays,
      scheduledDate,
      status: "in_progress",
      completedValue: progressValue(12),
      completedAt: null,
    };

    expect(
      prepareOccurrence({
        id,
        habit: current,
        scheduledDate,
        existingOccurrence,
      }),
    ).toEqual({ status: "unchanged", occurrence: existingOccurrence });
  });

  it("rejects reuse of an occurrence ID for different snapshot identity", () => {
    const conflictingOccurrence: Occurrence = {
      id,
      habitId: habitId("other-habit"),
      habitConfigVersion: current.configVersion,
      activityType: current.type,
      targetValue: current.targetValue,
      activeDays: current.activeDays,
      scheduledDate,
      status: "pending",
      completedValue: progressValue(0),
      completedAt: null,
    };

    expect(
      prepareOccurrence({
        id,
        habit: current,
        scheduledDate,
        existingOccurrence: conflictingOccurrence,
      }),
    ).toEqual({ status: "rejected", code: "occurrence_conflict" });

    expect(
      prepareOccurrence({
        id,
        habit: {
          ...current,
          targetValue: targetValue(44),
          configVersion: configurationVersion(4),
        },
        scheduledDate,
        existingOccurrence: {
          ...conflictingOccurrence,
          habitId: current.id,
        },
      }),
    ).toEqual({ status: "rejected", code: "occurrence_conflict" });
  });
});
