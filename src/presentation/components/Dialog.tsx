import type { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/presentation/components/IconButton";
import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface DialogProps extends PropsWithChildren {
  readonly onClose: () => void;
  readonly title: string;
  readonly visible: boolean;
}

export function Dialog({ children, onClose, title, visible }: DialogProps) {
  const { messages, theme } = usePresentation();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View
        accessibilityViewIsModal
        style={[
          styles.overlay,
          {
            backgroundColor: theme.colors.overlay,
            paddingTop: insets.top + theme.spacing.lg,
          },
        ]}
      >
        <Pressable
          accessibilityLabel={messages.common.close}
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.panel,
            theme.elevation.floating,
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
          <View style={styles.header}>
            <QubaText accessibilityRole="header" variant="heading">
              {title}
            </QubaText>
            <IconButton
              accessibilityLabel={messages.common.close}
              icon="close"
              onPress={onClose}
            />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  panel: { gap: 20, paddingHorizontal: 20, paddingTop: 20 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
});
