import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { idCopy } from "@/presentation/copy/id";

const palette = {
  light: {
    background: "#F7F5ED",
    foreground: "#18342C",
    muted: "#526860",
    surface: "#E7EFE8",
  },
  dark: {
    background: "#10221D",
    foreground: "#F4F1E6",
    muted: "#B6C7BF",
    surface: "#1A3930",
  },
} as const;

export function HomeScreen() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = palette[colorScheme];
  const copy = idCopy.foundation;

  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <View
          accessible
          accessibilityLabel={copy.statusLabel}
          accessibilityRole="summary"
          style={[styles.status, { backgroundColor: colors.surface }]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: colors.foreground }]}
          />
          <Text style={[styles.statusText, { color: colors.foreground }]}>
            {copy.statusLabel}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>
            {copy.eyebrow}
          </Text>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: colors.foreground }]}
          >
            {copy.title}
          </Text>
          <Text style={[styles.description, { color: colors.muted }]}>
            {copy.description}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  status: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  content: {
    gap: 12,
    paddingBottom: 48,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1.2,
    lineHeight: 48,
  },
  description: {
    fontSize: 18,
    lineHeight: 27,
    maxWidth: 520,
  },
});
