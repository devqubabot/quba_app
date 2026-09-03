import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon";
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import CalendarCheckIcon from "@hugeicons/core-free-icons/CalendarCheckIcon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import ChartBarLineIcon from "@hugeicons/core-free-icons/ChartBarLineIcon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import CircleIcon from "@hugeicons/core-free-icons/CircleIcon";
import EyeIcon from "@hugeicons/core-free-icons/EyeIcon";
import Home05Icon from "@hugeicons/core-free-icons/Home05Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import Mosque02Icon from "@hugeicons/core-free-icons/Mosque02Icon";
import Quran02Icon from "@hugeicons/core-free-icons/Quran02Icon";
import Robot01Icon from "@hugeicons/core-free-icons/Robot01Icon";
import Robot02Icon from "@hugeicons/core-free-icons/Robot02Icon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";
import TasbihIcon from "@hugeicons/core-free-icons/TasbihIcon";
import UserCircleIcon from "@hugeicons/core-free-icons/UserCircleIcon";
import ViewOffIcon from "@hugeicons/core-free-icons/ViewOffIcon";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import type { ColorValue } from "react-native";

import { usePresentation } from "@/presentation/theme/ThemeProvider";

export type AppIconName =
  | "account-circle"
  | "account-circle-outline"
  | "alert-circle-outline"
  | "alert-outline"
  | "arrow-left"
  | "book-open-page-variant-outline"
  | "book-outline"
  | "calendar-check"
  | "calendar-check-outline"
  | "chart-bar"
  | "check-circle"
  | "check-circle-outline"
  | "circle-outline"
  | "close"
  | "counter"
  | "eye-off-outline"
  | "eye-outline"
  | "home"
  | "home-outline"
  | "information-outline"
  | "mosque"
  | "plus"
  | "robot"
  | "robot-happy-outline"
  | "robot-outline"
  | "star-four-points-outline";

const iconMap = {
  "account-circle": UserCircleIcon,
  "account-circle-outline": UserCircleIcon,
  "alert-circle-outline": AlertCircleIcon,
  "alert-outline": Alert01Icon,
  "arrow-left": ArrowLeft02Icon,
  "book-open-page-variant-outline": Quran02Icon,
  "book-outline": BookOpen01Icon,
  "calendar-check": CalendarCheckIcon,
  "calendar-check-outline": CalendarCheckIcon,
  "chart-bar": ChartBarLineIcon,
  "check-circle": CheckmarkCircle02Icon,
  "check-circle-outline": CheckmarkCircle02Icon,
  "circle-outline": CircleIcon,
  close: Cancel01Icon,
  counter: TasbihIcon,
  "eye-off-outline": ViewOffIcon,
  "eye-outline": EyeIcon,
  home: Home05Icon,
  "home-outline": Home05Icon,
  "information-outline": InformationCircleIcon,
  mosque: Mosque02Icon,
  plus: Add01Icon,
  robot: Robot01Icon,
  "robot-happy-outline": Robot02Icon,
  "robot-outline": Robot01Icon,
  "star-four-points-outline": SparklesIcon,
} satisfies Record<AppIconName, IconSvgElement>;

interface AppIconProps {
  readonly color?: ColorValue;
  readonly name: AppIconName;
  readonly size?: number;
}

export function AppIcon({ color, name, size }: AppIconProps) {
  const { theme } = usePresentation();
  return (
    <HugeiconsIcon
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      color={String(color ?? theme.colors.text)}
      icon={iconMap[name]}
      size={size ?? theme.iconSizes.md}
      strokeWidth={1.8}
    />
  );
}
