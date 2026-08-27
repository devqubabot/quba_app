import {
  ActivityEvent,
  ActivityRun,
  LinkedActivityRun,
} from "../../domain/activities/activity";
import { Habit, Occurrence } from "../../domain/habits/habit";
import {
  emptyHabitStreak,
  HabitStreak,
  XpLedgerEntry,
} from "../../domain/rewards/rewards";
import { instant, localDate } from "../../domain/shared/time";
import {
  ActivityEventId,
  ActivityRunId,
  activityEventId,
  activityRunId,
  configurationVersion,
  deviceClockOffsetMinutes,
  HabitId,
  habitId,
  OccurrenceId,
  occurrenceId,
  positiveProgressDelta,
  progressValue,
  targetValue,
} from "../../domain/shared/values";
import {
  ActivityReconciliationTransaction,
  ActivityReconciliationUnitOfWork,
  ReconcileActivityEventUseCase,
} from "./reconcileActivityEvent";

const HABIT_ID = habitId("habit-dzikir");
const OCCURRENCE_ID = occurrenceId("occurrence-2026-08-27");
const RUN_ID = activityRunId("run-1");
const NOW = instant("2026-08-27T01:06:00.000Z");

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
  scheduledDate: localDate("2026-08-27"),
  status: "pending",
  completedValue: progressValue(0),
  completedAt: null,
};

const run: LinkedActivityRun = {
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
};

const event: ActivityEvent = {
  eventId: activityEventId("event-1"),
  activityRunId: RUN_ID,
  eventType: "progress_delta",
  activityType: "counter",
  progressDelta: positiveProgressDelta(33),
  habitId: HABIT_ID,
  occurrenceId: OCCURRENCE_ID,
  source: "robot",
  startedAt: instant("2026-08-27T01:00:00.000Z"),
  recordedAt: instant("2026-08-27T01:05:00.000Z"),
  deviceTimeOffsetMinutes: deviceClockOffsetMinutes(0),
};

class RecordingTransaction implements ActivityReconciliationTransaction {
  readonly writes: string[] = [];

  constructor(readonly processed: boolean) {}

  async hasProcessedEvent(_eventId: ActivityEventId): Promise<boolean> {
    return this.processed;
  }

  async getActivityRun(_id: ActivityRunId): Promise<ActivityRun | null> {
    return run;
  }

  async getHabit(_id: HabitId): Promise<Habit | null> {
    return habit;
  }

  async getOccurrence(_id: OccurrenceId): Promise<Occurrence | null> {
    return occurrence;
  }

  async getXpLedgerEntryForOccurrence(
    _id: OccurrenceId,
  ): Promise<XpLedgerEntry | null> {
    return null;
  }

  async getHabitStreak(_id: HabitId): Promise<HabitStreak | null> {
    return emptyHabitStreak(HABIT_ID);
  }

  async saveProcessedEvent(_event: ActivityEvent): Promise<void> {
    this.writes.push("event");
  }

  async saveActivityRun(_run: ActivityRun): Promise<void> {
    this.writes.push("run");
  }

  async saveOccurrence(_occurrence: Occurrence): Promise<void> {
    this.writes.push("occurrence");
  }

  async appendXpLedgerEntry(_entry: XpLedgerEntry): Promise<void> {
    this.writes.push("xp-ledger");
  }

  async saveHabitStreak(_streak: HabitStreak): Promise<void> {
    this.writes.push("streak");
  }
}

class RecordingUnitOfWork implements ActivityReconciliationUnitOfWork {
  transactionCount = 0;

  constructor(readonly transaction: RecordingTransaction) {}

  async runInTransaction<Result>(
    operation: (
      transaction: ActivityReconciliationTransaction,
    ) => Promise<Result>,
  ): Promise<Result> {
    this.transactionCount += 1;
    return operation(this.transaction);
  }
}

class FailingUnitOfWork implements ActivityReconciliationUnitOfWork {
  async runInTransaction<Result>(
    _operation: (
      transaction: ActivityReconciliationTransaction,
    ) => Promise<Result>,
  ): Promise<Result> {
    throw new Error("simulated transaction failure");
  }
}

const clock = { now: () => NOW };

describe("ReconcileActivityEventUseCase", () => {
  it("persists inbox, progress, ledger, and streak through one transaction", async () => {
    const transaction = new RecordingTransaction(false);
    const unitOfWork = new RecordingUnitOfWork(transaction);
    const useCase = new ReconcileActivityEventUseCase(unitOfWork, clock);

    const result = await useCase.execute(event);

    expect(result.status).toBe("applied");
    expect(unitOfWork.transactionCount).toBe(1);
    expect(transaction.writes).toEqual([
      "event",
      "run",
      "occurrence",
      "xp-ledger",
      "streak",
    ]);
  });

  it("acknowledges a persisted event without any retry writes", async () => {
    const transaction = new RecordingTransaction(true);
    const unitOfWork = new RecordingUnitOfWork(transaction);
    const useCase = new ReconcileActivityEventUseCase(unitOfWork, clock);

    await expect(useCase.execute(event)).resolves.toEqual({
      status: "duplicate",
      acknowledgeEvent: true,
    });
    expect(unitOfWork.transactionCount).toBe(1);
    expect(transaction.writes).toEqual([]);
  });

  it("returns a retryable failure and withholds acknowledgement on rollback", async () => {
    const useCase = new ReconcileActivityEventUseCase(
      new FailingUnitOfWork(),
      clock,
    );

    await expect(useCase.execute(event)).resolves.toEqual({
      status: "failed",
      code: "transaction_failed",
      retryable: true,
      acknowledgeEvent: false,
    });
  });
});
