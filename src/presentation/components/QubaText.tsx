import type { PropsWithChildren } from "react";
import { Text, type TextProps } from "react-native";

import { usePresentation } from "@/presentation/theme/ThemeProvider";
import type { QubaTheme } from "@/presentation/theme/tokens";

export type TextVariant = keyof QubaTheme["typography"];

interface QubaTextProps extends TextProps, PropsWithChildren {
  readonly color?: "default" | "muted" | "primary" | "danger";
  readonly variant?: TextVariant;
}

export function QubaText({
  children,
  color = "default",
  style,
  variant = "body",
  ...props
}: QubaTextProps) {
  const { theme } = usePresentation();
  const textColor = {
    default: theme.colors.text,
    muted: theme.colors.textMuted,
    primary: theme.colors.primaryStrong,
    danger: theme.colors.danger,
  }[color];

  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={2}
      style={[theme.typography[variant], { color: textColor }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
