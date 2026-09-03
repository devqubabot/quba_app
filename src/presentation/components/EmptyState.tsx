import { StyleSheet, View } from "react-native";

import type { EmptyStateMessage } from "@/presentation/copy/messages";
import { Button } from "@/presentation/components/Button";
import { QubaMascot } from "@/presentation/components/QubaMascot";
import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface EmptyStateProps {
  readonly message: EmptyStateMessage;
  readonly onAction?: () => void;
  readonly showMascot?: boolean;
}

export function EmptyState({
  message,
  onAction,
  showMascot = true,
}: EmptyStateProps) {
  const { theme } = usePresentation();
  return (
    <View style={styles.base}>
      {showMascot ? (
        <View
          style={[
            styles.mascotSurface,
            {
              backgroundColor: theme.colors.surfaceAccent,
              borderRadius: theme.radii.xl,
            },
          ]}
        >
          <QubaMascot variant="soft" />
        </View>
      ) : null}
      <View style={styles.copy}>
        <QubaText
          accessibilityRole="header"
          style={styles.center}
          variant="title"
        >
          {message.title}
        </QubaText>
        <QubaText color="muted" style={styles.center}>
          {message.description}
        </QubaText>
      </View>
      {onAction ? <Button label={message.action} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "center",
    gap: 24,
    justifyContent: "center",
    maxWidth: 520,
    paddingVertical: 24,
    width: "100%",
  },
  copy: { gap: 8 },
  center: { textAlign: "center" },
  mascotSurface: {
    alignItems: "center",
    alignSelf: "center",
    height: 220,
    justifyContent: "center",
    overflow: "hidden",
    width: 220,
  },
});
