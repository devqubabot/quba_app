import { StyleSheet, View } from "react-native";

import { AppIcon, type AppIconName } from "@/presentation/components/AppIcon";
import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

type StatusTone = "neutral" | "success" | "warning" | "danger";

interface StatusPillProps {
  readonly label: string;
  readonly tone?: StatusTone;
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const { theme } = usePresentation();
  const toneColor = {
    neutral: theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
  }[tone];
  const icon: AppIconName =
    tone === "success"
      ? "check-circle-outline"
      : tone === "warning"
        ? "alert-outline"
        : tone === "danger"
          ? "alert-circle-outline"
          : "information-outline";
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="summary"
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surfaceSoft,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <AppIcon color={toneColor} name={icon} size={theme.iconSizes.sm} />
      <QubaText style={{ color: toneColor }} variant="caption">
        {label}
      </QubaText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 6,
    minHeight: 32,
    paddingHorizontal: 12,
  },
});
