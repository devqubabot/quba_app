import { Pressable, StyleSheet, type PressableProps } from "react-native";

import { AppIcon, type AppIconName } from "@/presentation/components/AppIcon";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface IconButtonProps extends Omit<
  PressableProps,
  "accessibilityLabel" | "children"
> {
  readonly accessibilityLabel: string;
  readonly icon: AppIconName;
}

export function IconButton({
  accessibilityLabel,
  disabled,
  icon,
  style,
  ...props
}: IconButtonProps) {
  const { reduceMotion, theme } = usePresentation();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={4}
      style={(state) => [
        styles.base,
        {
          backgroundColor: theme.colors.surfaceSoft,
          borderRadius: theme.radii.sm,
          minHeight: theme.touchTargets.minimum,
          minWidth: theme.touchTargets.minimum,
          opacity: disabled ? 0.55 : 1,
        },
        state.pressed && !reduceMotion
          ? { transform: [{ scale: theme.motion.pressScale }] }
          : null,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <AppIcon name={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
});
