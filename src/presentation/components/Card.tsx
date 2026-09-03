import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { usePresentation } from "@/presentation/theme/ThemeProvider";

type CardTone = "default" | "soft" | "accent";

interface CardProps extends ViewProps, PropsWithChildren {
  readonly tone?: CardTone;
}

export function Card({
  children,
  style,
  tone = "default",
  ...props
}: CardProps) {
  const { theme } = usePresentation();
  const backgroundColor =
    tone === "default"
      ? theme.colors.surface
      : tone === "soft"
        ? theme.colors.surfaceSoft
        : theme.colors.surfaceAccent;
  return (
    <View
      style={[
        styles.base,
        tone === "default" ? theme.elevation.card : null,
        { backgroundColor, borderRadius: theme.radii.lg },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ base: { padding: 16 } });
