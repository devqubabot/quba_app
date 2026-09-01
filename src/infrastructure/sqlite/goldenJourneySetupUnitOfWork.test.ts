import {
  SetupActivityRunUseCase,
  SetupHabitOccurrenceUseCase,
} from "../../application/goldenJourney/setupGoldenJourney";
import {
  activityRunId,
  progressValue,
  targetValue,
} from "../../domain/shared/values";
import { SqliteGoldenJourneyRepository } from "./goldenJourneyRepository";
import { SqliteGoldenJourneySetupUnitOfWork } from "./goldenJourneySetupUnitOfWork";
import { migrateQubaDatabase } from "./migrations";
import {
  FIXTURE_HABIT_ID,
  FIXTURE_OCCURRENCE_ID,
  habitFixture,
  occurrenceFixture,
} from "./testing/fixtures";
import { NodeQubaSqliteDatabase } from "./testing/nodeSqliteDatabase";

describe("SQLite Golden Journey setup", () => {
  let database: NodeQubaSqliteDatabase;

  beforeEach(async () => {
    database = new NodeQubaSqliteDatabase();
    await migrateQubaDatabase(database);
  });

  afterEach(async () => {
    await database.close();
  });

  it("persists habit, occurrence, linked run, and standalone run idempotently", async () => {
    const unitOfWork = new SqliteGoldenJourneySetupUnitOfWork(database);
    const setupHabit = new SetupHabitOccurrenceUseCase(unitOfWork);
    const setupRun = new SetupActivityRunUseCase(unitOfWork);
    const habit = habitFixture();
    const occurrence = occurrenceFixture();

    await expect(
      setupHabit.execute({
        habit,
        occurrenceId: occurrence.id,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({ status: "applied", habit, occurrence });
    await expect(
      setupHabit.execute({
        habit: { ...habit },
        occurrenceId: occurrence.id,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({ status: "unchanged", habit, occurrence });

    const linkedCommand = {
      id: activityRunId("run-setup-linked"),
      type: "counter" as const,
      title: "Morning dhikr",
      targetValue: targetValue(10),
      linkMode: "linked" as const,
      habitId: FIXTURE_HABIT_ID,
      occurrenceId: FIXTURE_OCCURRENCE_ID,
    };
    const linkedResult = await setupRun.execute(linkedCommand);
    expect(linkedResult).toMatchObject({
      status: "applied",
      activityRun: { linkMode: "linked" },
    });

    const standaloneCommand = {
      id: activityRunId("run-setup-standalone"),
      type: "session" as const,
      title: "Tidy desk",
      targetValue: targetValue(15),
      linkMode: "standalone" as const,
    };
    const standaloneResult = await setupRun.execute(standaloneCommand);
    expect(standaloneResult).toMatchObject({
      status: "applied",
      activityRun: {
        linkMode: "standalone",
        habitId: null,
        occurrenceId: null,
      },
    });

    const repository = new SqliteGoldenJourneyRepository(database);
    const persistedLinked = await repository.getActivityRun(linkedCommand.id);
    const persistedStandalone = await repository.getActivityRun(
      standaloneCommand.id,
    );
    expect(persistedLinked).not.toBeNull();
    expect(persistedStandalone).not.toBeNull();
    if (persistedLinked === null || persistedStandalone === null) {
      throw new Error("Expected both activity runs to be persisted.");
    }

    await repository.updateActivityRun({
      ...persistedLinked,
      currentValue: progressValue(4),
      status: "active",
    });
    await repository.updateActivityRun({
      ...persistedStandalone,
      currentValue: progressValue(7),
      status: "paused",
    });

    await expect(setupRun.execute(linkedCommand)).resolves.toMatchObject({
      status: "unchanged",
      activityRun: { currentValue: 4, status: "active" },
    });
    await expect(setupRun.execute(standaloneCommand)).resolves.toMatchObject({
      status: "unchanged",
      activityRun: { currentValue: 7, status: "paused" },
    });

    expect(await count("habits")).toBe(1);
    expect(await count("occurrences")).toBe(1);
    expect(await count("activity_runs")).toBe(2);

    await expect(
      repository.getActivityRun(activityRunId("run-setup-standalone")),
    ).resolves.toMatchObject({
      linkMode: "standalone",
      habitId: null,
      occurrenceId: null,
      currentValue: 7,
      status: "paused",
    });
  });

  it("rejects conflicting run ID reuse without changing persisted state", async () => {
    const unitOfWork = new SqliteGoldenJourneySetupUnitOfWork(database);
    const setupRun = new SetupActivityRunUseCase(unitOfWork);
    const id = activityRunId("standalone-conflict");

    await expect(
      setupRun.execute({
        id,
        type: "session",
        title: "Tidy desk",
        targetValue: targetValue(15),
        linkMode: "standalone",
      }),
    ).resolves.toMatchObject({ status: "applied" });
    await expect(
      setupRun.execute({
        id,
        type: "session",
        title: "Different title",
        targetValue: targetValue(15),
        linkMode: "standalone",
      }),
    ).resolves.toEqual({
      status: "rejected",
      code: "activity_run_conflict",
    });

    const repository = new SqliteGoldenJourneyRepository(database);
    expect((await repository.getActivityRun(id))?.title).toBe("Tidy desk");
    expect(await count("activity_runs")).toBe(1);
  });

  it("rolls back the habit write when occurrence persistence fails, then retries", async () => {
    await database.exec(`
      CREATE TRIGGER test_fail_occurrence_insert
      BEFORE INSERT ON occurrences
      BEGIN
        SELECT RAISE(ABORT, 'simulated occurrence failure');
      END;
    `);
    const useCase = new SetupHabitOccurrenceUseCase(
      new SqliteGoldenJourneySetupUnitOfWork(database),
    );
    const habit = habitFixture();
    const occurrence = occurrenceFixture();

    await expect(
      useCase.execute({
        habit,
        occurrenceId: occurrence.id,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toEqual({
      status: "failed",
      code: "transaction_failed",
      retryable: true,
    });
    expect(await count("habits")).toBe(0);
    expect(await count("occurrences")).toBe(0);

    await database.exec("DROP TRIGGER test_fail_occurrence_insert;");
    await expect(
      useCase.execute({
        habit,
        occurrenceId: occurrence.id,
        scheduledDate: occurrence.scheduledDate,
      }),
    ).resolves.toMatchObject({ status: "applied" });
    expect(await count("habits")).toBe(1);
    expect(await count("occurrences")).toBe(1);
  });

  async function count(table: string): Promise<number> {
    const row = await database.getFirst<{ count: unknown }>(
      `SELECT COUNT(*) AS count FROM ${table};`,
    );
    return Number(row?.count ?? 0);
  }
});
