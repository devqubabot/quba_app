import {
  Instant,
  LocalDate,
  previousLocalDate,
  Weekday,
  weekdayOf,
} from "../shared/time";
import {
  ActivityEventId,
  HabitId,
  OccurrenceId,
  XpAmount,
  XpLedgerId,
  xpAmount,
  xpLedgerId,
} from "../shared/values";

export const DEFAULT_COMPLETION_XP = xpAmount(10);

export interface XpLedgerEntry {
  readonly ledgerId: XpLedgerId;
  readonly habitId: HabitId;
  readonly occurrenceId: OccurrenceId;
  readonly activityEventId: ActivityEventId;
  readonly xpDelta: XpAmount;
  readonly reason: "occurrence_completed";
  readonly createdAt: Instant;
}

export interface HabitStreak {
  readonly habitId: HabitId;
  readonly completedScheduledDates: readonly LocalDate[];
  readonly currentCount: number;
}

export function emptyHabitStreak(habitId: HabitId): HabitStreak {
  return { habitId, completedScheduledDates: [], currentCount: 0 };
}

export function ledgerIdForOccurrence(occurrenceId: OccurrenceId): XpLedgerId {
  return xpLedgerId(`occurrence-completion:${occurrenceId}`);
}

export function recordStreakCompletion(
  current: HabitStreak,
  activeDays: readonly Weekday[],
  scheduledDate: LocalDate,
): HabitStreak {
  if (current.completedScheduledDates.includes(scheduledDate)) {
    return current;
  }

  const completedScheduledDates = [
    ...current.completedScheduledDates,
    scheduledDate,
  ].sort();
  const completed = new Set<LocalDate>(completedScheduledDates);
  const activeDaySet = new Set<Weekday>(activeDays);
  let cursor = completedScheduledDates.at(-1);
  let currentCount = 0;

  while (cursor !== undefined) {
    if (activeDaySet.has(weekdayOf(cursor))) {
      if (!completed.has(cursor)) {
        break;
      }
      currentCount += 1;
    }
    cursor = previousLocalDate(cursor);
  }

  return { ...current, completedScheduledDates, currentCount };
}
