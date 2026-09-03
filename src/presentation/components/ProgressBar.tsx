import { StyleSheet, View } from "react-native";

import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface ProgressBarProps {
  readonly label: string;
  readonly value: number;
}

export function ProgressBar({ label, value }: ProgressBarProps) {
  const { theme } = usePresentation();
  const normalizedValue = Math.min(1, Math.max(0, value));
  const percent = Math.round(normalizedValue * 100);
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percent,
        text: `${percent}%`,
      }}
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.border,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: theme.colors.primaryStrong,
            borderRadius: theme.radii.pill,
            width: `${percent}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, overflow: "hidden", width: "100%" },
  fill: { height: "100%" },
});
