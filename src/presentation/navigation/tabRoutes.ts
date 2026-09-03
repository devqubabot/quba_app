import type { AppIconName } from "@/presentation/components/AppIcon";
import type { Messages } from "@/presentation/copy/messages";

export interface TabRoute {
  readonly activeIcon: AppIconName;
  readonly icon: AppIconName;
  readonly messageKey: keyof Messages["shell"]["tabs"];
  readonly name: "index" | "habits" | "quba" | "statistics" | "profile";
}

export const tabRoutes: readonly TabRoute[] = [
  {
    name: "index",
    messageKey: "home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    name: "habits",
    messageKey: "habits",
    icon: "calendar-check-outline",
    activeIcon: "calendar-check",
  },
  {
    name: "quba",
    messageKey: "quba",
    icon: "robot-outline",
    activeIcon: "robot",
  },
  {
    name: "statistics",
    messageKey: "statistics",
    icon: "chart-bar",
    activeIcon: "chart-bar",
  },
  {
    name: "profile",
    messageKey: "profile",
    icon: "account-circle-outline",
    activeIcon: "account-circle",
  },
] as const;

export function resolveTabIcon(
  route: TabRoute,
  selected: boolean,
): AppIconName {
  return selected ? route.activeIcon : route.icon;
}
