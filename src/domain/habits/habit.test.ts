import { instant } from "../shared/time";
import { configurationVersion, habitId, targetValue } from "../shared/values";
import { applyHabitConfiguration, Habit } from "./habit";

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
