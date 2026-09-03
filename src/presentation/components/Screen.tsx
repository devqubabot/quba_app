import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface ScreenProps extends PropsWithChildren {
  readonly edges?: readonly Edge[];
  readonly footer?: ReactNode;
  readonly scroll?: boolean;
  readonly testID?: string;
}

export function Screen({
  children,
  edges = ["top", "right", "left"],
  footer,
  scroll = true,
  testID,
}: ScreenProps) {
  const { theme } = usePresentation();
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView
      edges={[...edges]}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      testID={testID}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{content}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 24 },
  footer: { paddingBottom: 12, paddingHorizontal: 20, paddingTop: 8 },
});
