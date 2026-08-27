import {
  ActivityEvent,
  LinkedActivityRun,
  StandaloneActivityRun,
} from "../activities/activity";
import { Habit, Occurrence } from "../habits/habit";
import {
  emptyHabitStreak,
  HabitStreak,
  XpLedgerEntry,
} from "../rewards/rewards";
import { instant, localDate } from "../shared/time";
import {
  activityEventId,
  activityRunId,
  configurationVersion,
  deviceClockOffsetMinutes,
  habitId,
  occurrenceId,
  positiveProgressDelta,
  PositiveProgressDelta,
  progressValue,
  targetValue,
} from "../shared/values";
import {
  ActivityEventReconciliationContext,
  reconcileActivityEvent,
} from "./reconcileActivityEvent";

const HABIT_ID = habitId("habit-dzikir");
const OCCURRENCE_ID = occurrenceId("occurrence-2026-08-27");
const RUN_ID = activityRunId("run-1");
const RECORDED_AT = instant("2026-08-27T01:05:00.000Z");
const RECONCILED_AT = instant("2026-08-27T01:06:00.000Z");

const habit: Habit = {
  id: HABIT_ID,
  name: "Dzikir",
  type: "counter",
  targetValue: targetValue(33),
  activeDays: [4],
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
  scheduledDate: localDate("2026-08-27"),
  status: "pending",
  completedValue: progressValue(0),
  completedAt: null,
};

function linkedRun(
  overrides: Partial<LinkedActivityRun> = {},
): LinkedActivityRun {
  return {
    id: RUN_ID,
    type: "counter",
    title: "Dzikir 33 kali",
    linkMode: "linked",
    habitId: HABIT_ID,
    occurrenceId: OCCURRENCE_ID,
    targetValue: targetValue(33),
    currentValue: progressValue(0),
    status: "active",
    startedAt: instant("2026-08-27T01:00:00.000Z"),
    completedAt: null,
    ...overrides,
  };
}

function standaloneRun(
  overrides: Partial<StandaloneActivityRun> = {},
): StandaloneActivityRun {
  return {
    id: RUN_ID,
    type: "session",
    title: "Baca tenang",
    linkMode: "standalone",
    habitId: null,
    occurrenceId: null,
    targetValue: targetValue(15),
    currentValue: progressValue(0),
    status: "active",
    startedAt: instant("2026-08-27T01:00:00.000Z"),
    completedAt: null,
    ...overrides,
  };
}

function linkedEvent(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return {
    eventId: activityEventId("event-1"),
    activityRunId: RUN_ID,
    eventType: "progress_delta",
    activityType: "counter",
    progressDelta: positiveProgressDelta(33),
    habitId: HABIT_ID,
    occurrenceId: OCCURRENCE_ID,
    source: "robot",
    startedAt: instant("2026-08-27T01:00:00.000Z"),
    recordedAt: RECORDED_AT,
    deviceTimeOffsetMinutes: deviceClockOffsetMinutes(0),
    ...overrides,
  };
}

function context(
  overrides: Partial<ActivityEventReconciliationContext> = {},
): ActivityEventReconciliationContext {
  return {
    eventAlreadyProcessed: false,
    activityRun: linkedRun(),
    habit,
    occurrence,
    existingXpLedgerEntry: null,
    streak: emptyHabitStreak(HABIT_ID),
    reconciledAt: RECONCILED_AT,
    ...overrides,
  };
}

describe("reconcileActivityEvent", () => {
  it("completes a linked occurrence with exactly one XP and streak update", () => {
    const result = reconcileActivityEvent(linkedEvent(), context());

    expect(result.status).toBe("applied");
    if (result.status !== "applied") {
      throw new Error("Expected the event to be applied.");
    }

    expect(result.activityRun).toMatchObject({
      currentValue: 33,
      status: "completed",
      completedAt: RECORDED_AT,
    });
    expect(result.occurrence).toMatchObject({
      completedValue: 33,
      status: "completed",
      completedAt: RECORDED_AT,
    });
    expect(result.xpLedgerEntry).toMatchObject({
      occurrenceId: OCCURRENCE_ID,
      activityEventId: activityEventId("event-1"),
      xpDelta: 10,
      reason: "occurrence_completed",
      createdAt: RECONCILED_AT,
    });
    expect(result.streak).toEqual({
      habitId: HABIT_ID,
      completedScheduledDates: [localDate("2026-08-27")],
      currentCount: 1,
    });
    expect(result.occurrenceCompleted).toBe(true);
  });

  it("acknowledges a repeated event without calculating or mutating state", () => {
    expect(
      reconcileActivityEvent(
        linkedEvent(),
        context({
          eventAlreadyProcessed: true,
          activityRun: null,
          habit: null,
          occurrence: null,
          streak: null,
        }),
      ),
    ).toEqual({ status: "duplicate", acknowledgeEvent: true });
  });

  it("completes a partial linked run without rewarding its occurrence early", () => {
    const sessionHabit: Habit = {
      ...habit,
      type: "session",
      targetValue: targetValue(30),
    };
    const run = linkedRun({
      type: "session",
      targetValue: targetValue(15),
    });
    const event = linkedEvent({
      activityType: "session",
      progressDelta: positiveProgressDelta(15),
    });
    const result = reconcileActivityEvent(
      event,
      context({
        activityRun: run,
        habit: sessionHabit,
        occurrence: {
          ...occurrence,
          activityType: "session",
          targetValue: targetValue(30),
        },
      }),
    );

    expect(result.status).toBe("applied");
    if (result.status !== "applied") {
      throw new Error("Expected the event to be applied.");
    }

    expect(result.runCompleted).toBe(true);
    expect(result.occurrence).toMatchObject({
      status: "in_progress",
      completedValue: 15,
    });
    expect(result.occurrenceCompleted).toBe(false);
    expect(result.xpLedgerEntry).toBeNull();
    expect(result.streak).toBeNull();
  });

  it("combines several linked runs before completing one occurrence", () => {
    const sessionHabit: Habit = {
      ...habit,
      type: "session",
      targetValue: targetValue(30),
    };
    const firstResult = reconcileActivityEvent(
      linkedEvent({
        activityType: "session",
        progressDelta: positiveProgressDelta(15),
      }),
      context({
        habit: sessionHabit,
        occurrence: {
          ...occurrence,
          activityType: "session",
          targetValue: targetValue(30),
        },
        activityRun: linkedRun({
          type: "session",
          targetValue: targetValue(15),
        }),
      }),
    );

    expect(firstResult.status).toBe("applied");
    if (firstResult.status !== "applied" || firstResult.occurrence === null) {
      throw new Error("Expected the first run to update the occurrence.");
    }

    const secondRunId = activityRunId("run-2");
    const secondResult = reconcileActivityEvent(
      linkedEvent({
        eventId: activityEventId("event-2"),
        activityRunId: secondRunId,
        activityType: "session",
        progressDelta: positiveProgressDelta(15),
      }),
      context({
        habit: sessionHabit,
        occurrence: firstResult.occurrence,
        activityRun: linkedRun({
          id: secondRunId,
          type: "session",
          targetValue: targetValue(15),
        }),
      }),
    );

    expect(secondResult.status).toBe("applied");
    if (secondResult.status !== "applied") {
      throw new Error("Expected the second run to be applied.");
    }

    expect(secondResult.occurrence).toMatchObject({
      completedValue: 30,
      status: "completed",
    });
    expect(secondResult.xpLedgerEntry).toMatchObject({
      activityEventId: activityEventId("event-2"),
      xpDelta: 10,
    });
    expect(secondResult.streak?.currentCount).toBe(1);
  });

  it("completes a standalone run without changing occurrence or rewards", () => {
    const event = linkedEvent({
      activityType: "session",
      progressDelta: positiveProgressDelta(15),
      habitId: null,
      occurrenceId: null,
    });
    const result = reconcileActivityEvent(
      event,
      context({
        activityRun: standaloneRun(),
        habit: null,
        occurrence: null,
        streak: null,
      }),
    );

    expect(result.status).toBe("applied");
    if (result.status !== "applied") {
      throw new Error("Expected the event to be applied.");
    }

    expect(result.activityRun).toMatchObject({
      status: "completed",
      currentValue: 15,
    });
    expect(result.occurrence).toBeNull();
    expect(result.xpLedgerEntry).toBeNull();
    expect(result.streak).toBeNull();
    expect(result.occurrenceCompleted).toBe(false);
  });

  it.each([
    {
      name: "missing activity run",
      event: linkedEvent(),
      state: context({ activityRun: null }),
      code: "activity_run_not_found",
    },
    {
      name: "cancelled activity run",
      event: linkedEvent(),
      state: context({ activityRun: linkedRun({ status: "cancelled" }) }),
      code: "activity_run_not_accepting_progress",
    },
    {
      name: "missing habit",
      event: linkedEvent(),
      state: context({ habit: null }),
      code: "habit_not_found",
    },
    {
      name: "missing occurrence",
      event: linkedEvent(),
      state: context({ occurrence: null }),
      code: "occurrence_not_found",
    },
    {
      name: "skipped occurrence",
      event: linkedEvent(),
      state: context({ occurrence: { ...occurrence, status: "skipped" } }),
      code: "occurrence_unavailable",
    },
    {
      name: "mismatched occurrence",
      event: linkedEvent({ occurrenceId: occurrenceId("other-occurrence") }),
      state: context(),
      code: "link_mismatch",
    },
    {
      name: "non-positive progress",
      event: linkedEvent({ progressDelta: 0 as PositiveProgressDelta }),
      state: context(),
      code: "invalid_progress_delta",
    },
    {
      name: "event recorded after habit archival",
      event: linkedEvent(),
      state: context({
        habit: { ...habit, archivedAt: instant("2026-08-27T00:00:00.000Z") },
      }),
      code: "habit_unavailable",
    },
  ])("rejects $name without acknowledgement", ({ event, state, code }) => {
    expect(reconcileActivityEvent(event, state)).toEqual({
      status: "rejected",
      acknowledgeEvent: false,
      code,
    });
  });

  it("keeps a delayed offline event recorded before habit archival", () => {
    const result = reconcileActivityEvent(
      linkedEvent(),
      context({
        habit: {
          ...habit,
          enabled: false,
          archivedAt: instant("2026-08-27T02:00:00.000Z"),
        },
      }),
    );

    expect(result.status).toBe("applied");
    expect(result.acknowledgeEvent).toBe(true);
  });

  it("uses the occurrence configuration snapshot for delayed events", () => {
    const historicalOccurrence: Occurrence = {
      ...occurrence,
      habitConfigVersion: configurationVersion(1),
      activityType: "session",
      targetValue: targetValue(30),
      activeDays: [4],
    };
    const currentHabit: Habit = {
      ...habit,
      type: "counter",
      targetValue: targetValue(1),
      activeDays: [5],
      configVersion: configurationVersion(2),
    };
    const result = reconcileActivityEvent(
      linkedEvent({
        activityType: "session",
        progressDelta: positiveProgressDelta(15),
      }),
      context({
        activityRun: linkedRun({
          type: "session",
          targetValue: targetValue(15),
        }),
        habit: currentHabit,
        occurrence: historicalOccurrence,
      }),
    );

    expect(result.status).toBe("applied");
    if (result.status !== "applied") {
      throw new Error("Expected the delayed event to be applied.");
    }

    expect(result.occurrence).toMatchObject({
      status: "in_progress",
      completedValue: 15,
      targetValue: 30,
    });
    expect(result.xpLedgerEntry).toBeNull();
    expect(result.streak).toBeNull();
  });

  it("accepts extra unique progress without rewarding a completed occurrence again", () => {
    const completedOccurrence: Occurrence = {
      ...occurrence,
      status: "completed",
      completedValue: progressValue(33),
      completedAt: RECORDED_AT,
    };
    const existingLedger: XpLedgerEntry = {
      ledgerId:
        "occurrence-completion:occurrence-2026-08-27" as XpLedgerEntry["ledgerId"],
      habitId: HABIT_ID,
      occurrenceId: OCCURRENCE_ID,
      activityEventId: activityEventId("event-1"),
      xpDelta: 10 as XpLedgerEntry["xpDelta"],
      reason: "occurrence_completed",
      createdAt: RECONCILED_AT,
    };
    const streak: HabitStreak = {
      habitId: HABIT_ID,
      completedScheduledDates: [occurrence.scheduledDate],
      currentCount: 1,
    };
    const result = reconcileActivityEvent(
      linkedEvent({
        eventId: activityEventId("event-2"),
        progressDelta: positiveProgressDelta(2),
      }),
      context({
        activityRun: linkedRun({
          status: "completed",
          currentValue: progressValue(33),
          completedAt: RECORDED_AT,
        }),
        occurrence: completedOccurrence,
        existingXpLedgerEntry: existingLedger,
        streak,
      }),
    );

    expect(result.status).toBe("applied");
    if (result.status !== "applied") {
      throw new Error("Expected the event to be applied.");
    }

    expect(result.occurrence).toMatchObject({ completedValue: 35 });
    expect(result.xpLedgerEntry).toBeNull();
    expect(result.streak).toBeNull();
    expect(result.occurrenceCompleted).toBe(false);
  });
});
