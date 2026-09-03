import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/presentation/components/Button";
import { IconButton } from "@/presentation/components/IconButton";
import { QubaText } from "@/presentation/components/QubaText";
import { onboardingFlowCopy } from "@/presentation/onboarding/flowCopy";
import { usePresentation } from "@/presentation/theme/ThemeProvider";
import { primaryGlow, roundedFont } from "@/presentation/theme/tokens";

interface FrameProps extends PropsWithChildren {
  readonly label: string;
  readonly title: string;
  readonly description?: string;
  readonly step?: string;
  readonly centered?: boolean;
  readonly onBack: () => void;
}

export function OnboardingFrame({
  label,
  title,
  description,
  step,
  centered,
  onBack,
  children,
}: FrameProps) {
  const { locale, theme } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={[styles.fill, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <IconButton
              accessibilityLabel={copy.back}
              icon="arrow-left"
              onPress={onBack}
              style={styles.back}
            />
            <QubaText style={styles.headerLabel}>{label}</QubaText>
          </View>
          <View style={centered && styles.centered}>
            {step ? (
              <QubaText color="primary" style={styles.eyebrow}>
                {step}
              </QubaText>
            ) : null}
            <QubaText
              accessibilityRole="header"
              style={[styles.title, centered && styles.centerText]}
            >
              {title}
            </QubaText>
            {description ? (
              <QubaText
                color="muted"
                style={[styles.body, centered && styles.centerText]}
              >
                {description}
              </QubaText>
            ) : null}
          </View>
          <View style={styles.children}>{children}</View>
          <View style={styles.preview}>
            <QubaText
              color="primary"
              variant="caption"
              style={styles.previewLabel}
            >
              {copy.preview}
            </QubaText>
            <QubaText color="muted" variant="caption" style={styles.centerText}>
              {copy.previewNote}
            </QubaText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function OnboardingAction({
  label,
  onPress,
}: {
  readonly label: string;
  readonly onPress: () => void;
}) {
  const { theme } = usePresentation();
  return (
    <Button
      label={label}
      onPress={onPress}
      style={{
        borderRadius: 17,
        paddingVertical: 12,
        experimental_backgroundImage: `linear-gradient(135deg, ${theme.colors.primaryPressed}, ${theme.colors.primary})`,
        boxShadow: primaryGlow.boxShadow,
      }}
    />
  );
}

// These layout measurements mirror the approved Character Pop onboarding,
// rather than changing the typography of unrelated, parked feature screens.
const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  header: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  back: { borderRadius: 999 },
  headerLabel: {
    fontFamily: roundedFont(800),
    fontSize: 17,
    flexShrink: 1,
  },
  title: {
    fontFamily: roundedFont(900),
    fontSize: 29,
    lineHeight: 33.35,
    marginTop: 10,
    marginBottom: 8,
  },
  body: { fontSize: 14, lineHeight: 21.7 },
  eyebrow: {
    fontFamily: roundedFont(800),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.96,
    textTransform: "uppercase",
  },
  children: { marginTop: 26, gap: 16 },
  centered: { alignItems: "center" },
  centerText: { textAlign: "center" },
  preview: { marginTop: "auto", paddingTop: 28, gap: 4, alignItems: "center" },
  previewLabel: { fontFamily: roundedFont(700) },
});
