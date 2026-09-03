import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import { AppIcon, type AppIconName } from "@/presentation/components/AppIcon";
import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends Omit<PressableProps, "children"> {
  readonly icon?: AppIconName;
  readonly label: string;
  readonly loading?: boolean;
  readonly variant?: ButtonVariant;
}

export function Button({
  accessibilityLabel,
  disabled,
  icon,
  label,
  loading = false,
  style,
  variant = "primary",
  ...props
}: ButtonProps) {
  const { reduceMotion, theme } = usePresentation();
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
        ? theme.colors.danger
        : theme.colors.surfaceSoft;
  const foregroundColor =
    variant === "primary"
      ? theme.colors.onPrimary
      : variant === "danger"
        ? theme.colors.surface
        : theme.colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: theme.radii.md,
          minHeight: theme.touchTargets.comfortable,
          opacity: isDisabled ? 0.55 : 1,
        },
        state.pressed && !reduceMotion
          ? { transform: [{ scale: theme.motion.pressScale }] }
          : null,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : icon ? (
        <AppIcon color={foregroundColor} name={icon} />
      ) : null}
      <QubaText style={{ color: foregroundColor }} variant="label">
        {label}
      </QubaText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
