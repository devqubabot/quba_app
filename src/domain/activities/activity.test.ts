import { Habit, Occurrence } from "../habits/habit";
import { instant, localDate } from "../shared/time";
import {
  activityRunId,
  configurationVersion,
  habitId,
  occurrenceId,
  progressValue,
  targetValue,
} from "../shared/values";
import { ActivityRun, prepareActivityRun } from "./activity";

const HABIT_ID = habitId("habit-reading");
const OCCURRENCE_ID = occurrenceId("occurrence-reading-2026-08-31");
const RUN_ID = activityRunId("run-reading");

const habit: Habit = {
  id: HABIT_ID,
  name: "Baca buku",
  type: "session",
  targetValue: targetValue(30),
  activeDays: [1],
  enabled: true,
  archivedAt: null,
  configVersion: configurationVersion(1),
};

const occurrence: Occurrence = {
  id: OCCURRENCE_ID,
  habitId: HABIT_ID,
  habitConfigVersion: habit.configVersion,
  activityType: habit.type,
  targetValue: habit.targetValue,
  activeDays: habit.activeDays,
  scheduledDate: localDate("2026-08-31"),
  status: "pending",
  completedValue: progressValue(0),
  completedAt: null,
};

describe("prepareActivityRun", () => {
  it("creates a compatible linked activity run", () => {
    expect(
      prepareActivityRun({
        id: RUN_ID,
        type: "session",
        title: "  Baca 15 menit  ",
        targetValue: targetValue(15),
        linkMode: "linked",
        habitId: HABIT_ID,
        occurrenceId: OCCURRENCE_ID,
        habit,
        occurrence,
        existingActivityRun: null,
      }),
    ).toEqual({
      status: "created",
      activityRun: {
        id: RUN_ID,
        type: "session",
        title: "Baca 15 menit",
        targetValue: targetValue(15),
        currentValue: progressValue(0),
        status: "draft",
        linkMode: "linked",
        habitId: HABIT_ID,
        occurrenceId: OCCURRENCE_ID,
        startedAt: null,
        completedAt: null,
      },
    });
  });

  it("creates a standalone run with no habit state", () => {
    expect(
      prepareActivityRun({
        id: activityRunId("run-tidy-desk"),
        type: "session",
        title: "Bereskan meja",
        targetValue: targetValue(15),
        linkMode: "standalone",
        existingActivityRun: null,
      }),
    ).toMatchObject({
      status: "created",
      activityRun: {
        linkMode: "standalone",
        habitId: null,
        occurrenceId: null,
      },
    });
  });

  it("rejects unavailable, mismatched, and completed linked context", () => {
    const input = {
      id: RUN_ID,
      type: "session" as const,
      title: "Baca 15 menit",
      targetValue: targetValue(15),
      linkMode: "linked" as const,
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
      existingActivityRun: null,
    };

    expect(prepareActivityRun({ ...input, habit: null, occurrence })).toEqual({
      status: "rejected",
      code: "habit_unavailable",
    });
    expect(
      prepareActivityRun({
        ...input,
        habit,
        occurrence: { ...occurrence, habitId: habitId("other-habit") },
      }),
    ).toEqual({ status: "rejected", code: "link_mismatch" });
    expect(
      prepareActivityRun({
        ...input,
        habit,
        occurrence: { ...occurrence, status: "completed" },
      }),
    ).toEqual({ status: "rejected", code: "occurrence_unavailable" });
    expect(
      prepareActivityRun({
        ...input,
        habit: { ...habit, type: "counter" },
        occurrence,
      }),
    ).toEqual({ status: "rejected", code: "activity_type_mismatch" });
  });

  it("preserves a progressed run on retry and rejects conflicting ID reuse", () => {
    const existingActivityRun: ActivityRun = {
      id: RUN_ID,
      type: "session",
      title: "Baca 15 menit",
      targetValue: targetValue(15),
      currentValue: progressValue(15),
      status: "completed",
      linkMode: "linked",
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
      startedAt: instant("2026-08-31T01:00:00.000Z"),
      completedAt: instant("2026-08-31T01:15:00.000Z"),
    };
    const input = {
      id: RUN_ID,
      type: "session" as const,
      title: "Baca 15 menit",
      targetValue: targetValue(15),
      linkMode: "linked" as const,
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
      habit: null,
      occurrence: null,
      existingActivityRun,
    };

    expect(prepareActivityRun(input)).toEqual({
      status: "unchanged",
      activityRun: existingActivityRun,
    });
    expect(prepareActivityRun({ ...input, title: "Different title" })).toEqual({
      status: "rejected",
      code: "activity_run_conflict",
    });
  });
});
