import { resolveTabIcon, tabRoutes } from "@/presentation/navigation/tabRoutes";

describe("signed-in tab destinations", () => {
  it("defines the five product destinations with one coherent icon family", () => {
    expect(tabRoutes.map(({ name }) => name)).toEqual([
      "index",
      "habits",
      "quba",
      "statistics",
      "profile",
    ]);
    expect(new Set(tabRoutes.map(({ messageKey }) => messageKey)).size).toBe(5);
    expect(
      tabRoutes.every(
        ({ activeIcon, icon }) => activeIcon.length > 0 && icon.length > 0,
      ),
    ).toBe(true);
  });

  it("uses a filled icon as a redundant selected-state cue", () => {
    const home = tabRoutes[0];
    expect(home).toBeDefined();
    if (!home) return;
    expect(resolveTabIcon(home, false)).toBe("home-outline");
    expect(resolveTabIcon(home, true)).toBe("home");
  });
});
