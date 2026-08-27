import { ActivityEvent, ActivityRun } from "../activities/activity";
import { Habit, Occurrence } from "../habits/habit";
import {
  DEFAULT_COMPLETION_XP,
  emptyHabitStreak,
  HabitStreak,
  ledgerIdForOccurrence,
  recordStreakCompletion,
  XpLedgerEntry,
} from "../rewards/rewards";
import { Instant, isAfterInstant, weekdayOf } from "../shared/time";
import { progressValue } from "../shared/values";

export type ReconciliationRejectionCode =
  | "activity_run_not_found"
  | "activity_run_not_accepting_progress"
  | "invalid_progress_delta"
  | "progress_overflow"
  | "activity_type_mismatch"
  | "link_mismatch"
  | "habit_not_found"
  | "habit_unavailable"
  | "occurrence_not_found"
  | "occurrence_unavailable"
  | "occurrence_not_scheduled"
  | "inconsistent_reward_state";

export interface ActivityEventReconciliationContext {
  readonly eventAlreadyProcessed: boolean;
  readonly activityRun: ActivityRun | null;
  readonly habit: Habit | null;
  readonly occurrence: Occurrence | null;
  readonly existingXpLedgerEntry: XpLedgerEntry | null;
  readonly streak: HabitStreak | null;
  readonly reconciledAt: Instant;
}

export type ActivityEventReconciliationResult =
  | {
      readonly status: "duplicate";
      readonly acknowledgeEvent: true;
    }
  | {
      readonly status: "rejected";
      readonly acknowledgeEvent: false;
      readonly code: ReconciliationRejectionCode;
    }
  | {
      readonly status: "applied";
      readonly acknowledgeEvent: true;
      readonly processedEvent: ActivityEvent;
      readonly activityRun: ActivityRun;
      readonly occurrence: Occurrence | null;
      readonly xpLedgerEntry: XpLedgerEntry | null;
      readonly streak: HabitStreak | null;
      readonly runCompleted: boolean;
      readonly occurrenceCompleted: boolean;
    };

export function reconcileActivityEvent(
  event: ActivityEvent,
  context: ActivityEventReconciliationContext,
): ActivityEventReconciliationResult {
  if (context.eventAlreadyProcessed) {
    return { status: "duplicate", acknowledgeEvent: true };
  }

  if (!Number.isSafeInteger(event.progressDelta) || event.progressDelta <= 0) {
    return rejected("invalid_progress_delta");
  }

  const run = context.activityRun;
  if (run === null) {
    return rejected("activity_run_not_found");
  }

  if (run.status === "draft" || run.status === "cancelled") {
    return rejected("activity_run_not_accepting_progress");
  }

  if (run.type !== event.activityType) {
    return rejected("activity_type_mismatch");
  }

  if (run.linkMode === "standalone") {
    return reconcileStandalone(event, run);
  }

  return reconcileLinked(event, run, context);
}

function reconcileStandalone(
  event: ActivityEvent,
  run: ActivityRun,
): ActivityEventReconciliationResult {
  if (
    run.linkMode !== "standalone" ||
    event.habitId !== null ||
    event.occurrenceId !== null
  ) {
    return rejected("link_mismatch");
  }

  const rawNextValue = run.currentValue + event.progressDelta;
  if (!Number.isSafeInteger(rawNextValue)) {
    return rejected("progress_overflow");
  }
  const nextValue = progressValue(rawNextValue);
  const wasCompleted = run.status === "completed";
  const isCompleted = wasCompleted || nextValue >= run.targetValue;
  const activityRun: ActivityRun = {
    ...run,
    currentValue: nextValue,
    status: isCompleted ? "completed" : "active",
    completedAt: isCompleted ? (run.completedAt ?? event.recordedAt) : null,
  };

  return {
    status: "applied",
    acknowledgeEvent: true,
    processedEvent: event,
    activityRun,
    occurrence: null,
    xpLedgerEntry: null,
    streak: null,
    runCompleted: !wasCompleted && isCompleted,
    occurrenceCompleted: false,
  };
}

function reconcileLinked(
  event: ActivityEvent,
  run: ActivityRun,
  context: ActivityEventReconciliationContext,
): ActivityEventReconciliationResult {
  if (
    run.linkMode !== "linked" ||
    event.habitId === null ||
    event.occurrenceId === null ||
    run.habitId !== event.habitId ||
    run.occurrenceId !== event.occurrenceId
  ) {
    return rejected("link_mismatch");
  }

  const habit = context.habit;
  if (habit === null) {
    return rejected("habit_not_found");
  }

  if (
    habit.archivedAt !== null &&
    isAfterInstant(event.recordedAt, habit.archivedAt)
  ) {
    return rejected("habit_unavailable");
  }

  const occurrence = context.occurrence;
  if (occurrence === null) {
    return rejected("occurrence_not_found");
  }

  if (
    habit.id !== run.habitId ||
    occurrence.habitId !== habit.id ||
    occurrence.id !== run.occurrenceId
  ) {
    return rejected("link_mismatch");
  }

  if (habit.type !== run.type || occurrence.status === "skipped") {
    return rejected(
      habit.type !== run.type
        ? "activity_type_mismatch"
        : "occurrence_unavailable",
    );
  }

  if (!habit.activeDays.includes(weekdayOf(occurrence.scheduledDate))) {
    return rejected("occurrence_not_scheduled");
  }

  const rawRunValue = run.currentValue + event.progressDelta;
  const rawOccurrenceValue = occurrence.completedValue + event.progressDelta;
  if (
    !Number.isSafeInteger(rawRunValue) ||
    !Number.isSafeInteger(rawOccurrenceValue)
  ) {
    return rejected("progress_overflow");
  }

  const wasRunCompleted = run.status === "completed";
  const runValue = progressValue(rawRunValue);
  const isRunCompleted = wasRunCompleted || runValue >= run.targetValue;
  const activityRun: ActivityRun = {
    ...run,
    currentValue: runValue,
    status: isRunCompleted ? "completed" : "active",
    completedAt: isRunCompleted ? (run.completedAt ?? event.recordedAt) : null,
  };

  const wasOccurrenceCompleted = occurrence.status === "completed";
  const occurrenceValue = progressValue(rawOccurrenceValue);
  const isOccurrenceCompleted =
    wasOccurrenceCompleted || occurrenceValue >= habit.targetValue;

  if (wasOccurrenceCompleted !== (context.existingXpLedgerEntry !== null)) {
    return rejected("inconsistent_reward_state");
  }

  if (
    (context.existingXpLedgerEntry !== null &&
      (context.existingXpLedgerEntry.habitId !== habit.id ||
        context.existingXpLedgerEntry.occurrenceId !== occurrence.id)) ||
    (context.streak !== null && context.streak.habitId !== habit.id)
  ) {
    return rejected("inconsistent_reward_state");
  }

  const updatedOccurrence: Occurrence = {
    ...occurrence,
    completedValue: occurrenceValue,
    status: isOccurrenceCompleted ? "completed" : "in_progress",
    completedAt: isOccurrenceCompleted
      ? (occurrence.completedAt ?? event.recordedAt)
      : null,
  };

  const occurrenceCompleted = !wasOccurrenceCompleted && isOccurrenceCompleted;
  const xpLedgerEntry: XpLedgerEntry | null = occurrenceCompleted
    ? {
        ledgerId: ledgerIdForOccurrence(occurrence.id),
        habitId: habit.id,
        occurrenceId: occurrence.id,
        activityEventId: event.eventId,
        xpDelta: DEFAULT_COMPLETION_XP,
        reason: "occurrence_completed",
        createdAt: context.reconciledAt,
      }
    : null;
  const streak = occurrenceCompleted
    ? recordStreakCompletion(
        context.streak ?? emptyHabitStreak(habit.id),
        habit.activeDays,
        occurrence.scheduledDate,
      )
    : null;

  return {
    status: "applied",
    acknowledgeEvent: true,
    processedEvent: event,
    activityRun,
    occurrence: updatedOccurrence,
    xpLedgerEntry,
    streak,
    runCompleted: !wasRunCompleted && isRunCompleted,
    occurrenceCompleted,
  };
}

function rejected(
  code: ReconciliationRejectionCode,
): ActivityEventReconciliationResult {
  return { status: "rejected", acknowledgeEvent: false, code };
}
