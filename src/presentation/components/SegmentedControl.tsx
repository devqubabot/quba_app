import { Pressable, StyleSheet, View } from "react-native";

import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

export interface Segment<Value extends string> {
  readonly label: string;
  readonly value: Value;
}
interface SegmentedControlProps<Value extends string> {
  readonly accessibilityLabel: string;
  readonly onChange: (value: Value) => void;
  readonly options: readonly Segment<Value>[];
  readonly value: Value;
}

export function SegmentedControl<Value extends string>({
  accessibilityLabel,
  onChange,
  options,
  value,
}: SegmentedControlProps<Value>) {
  const { theme } = usePresentation();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      style={[
        styles.group,
        {
          backgroundColor: theme.colors.surfaceSoft,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                backgroundColor: selected
                  ? theme.colors.surface
                  : "transparent",
                borderRadius: theme.radii.sm,
                minHeight: theme.touchTargets.minimum,
              },
            ]}
          >
            <QubaText color={selected ? "default" : "muted"} variant="label">
              {option.label}
            </QubaText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: "row", gap: 4, padding: 4 },
  option: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
