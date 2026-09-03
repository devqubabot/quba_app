import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QubaText } from "@/presentation/components/QubaText";
import { QubaMascot } from "@/presentation/components/QubaMascot";
import { usePresentation } from "@/presentation/theme/ThemeProvider";
import {
  brandExclamation,
  primaryGlow,
  roundedFont,
  tone,
  welcomeHero,
} from "@/presentation/theme/tokens";

interface OnboardingScreenProps {
  readonly onContinue?: () => void;
  readonly onSignIn?: () => void;
}

// Measurements mirror screen-welcome in the approved Character Pop reference.
export function OnboardingScreen({
  onContinue,
  onSignIn,
}: OnboardingScreenProps) {
  const { messages, reduceMotion, theme } = usePresentation();
  const copy = messages.onboarding;
  const muted = tone(welcomeHero.mutedText, theme.appearance);
  const interactive = tone(welcomeHero.interactiveText, theme.appearance);

  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topbar}>
          <QubaText
            accessibilityLabel="Quba"
            style={[styles.brand, { color: theme.colors.text }]}
          >
            Quba
            <Text style={{ color: tone(brandExclamation, theme.appearance) }}>
              !
            </Text>
          </QubaText>
          <Pressable
            accessibilityRole="button"
            onPress={onSignIn}
            style={styles.signIn}
          >
            <QubaText style={[styles.signInLabel, { color: interactive }]}>
              {copy.signIn}
            </QubaText>
          </Pressable>
        </View>
        <View>
          <QubaText style={[styles.eyebrow, { color: interactive }]}>
            {copy.eyebrow}
          </QubaText>
          <QubaText
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.text }]}
          >
            {copy.title}
          </QubaText>
          <QubaText style={[styles.body, { color: muted }]}>
            {copy.description}
          </QubaText>
        </View>
        <View style={styles.visual}>
          <View
            pointerEvents="none"
            style={[
              styles.circle,
              { backgroundColor: theme.colors.surfaceAccent },
            ]}
          />
          <QubaMascot
            accessibilityLabel={copy.mascotLabel}
            variant="soft"
            style={styles.mascot}
          />
        </View>
        <View
          accessible
          accessibilityLabel={copy.stepLabel}
          style={styles.dots}
        >
          <View
            style={[
              styles.dot,
              styles.activeDot,
              {
                backgroundColor: tone(
                  welcomeHero.progressActive,
                  theme.appearance,
                ),
              },
            ]}
          />
          <View
            style={[styles.dot, { backgroundColor: theme.colors.border }]}
          />
          <View
            style={[styles.dot, { backgroundColor: theme.colors.border }]}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [
            styles.activate,
            {
              backgroundColor: theme.colors.primary,
              experimental_backgroundImage: `linear-gradient(135deg, ${theme.colors.primaryPressed}, ${theme.colors.primary})`,
            },
            pressed && !reduceMotion
              ? { transform: [{ scale: theme.motion.pressScale }] }
              : null,
          ]}
        >
          <QubaText
            style={[styles.activateLabel, { color: theme.colors.onPrimary }]}
          >
            {copy.action}
          </QubaText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  topbar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: roundedFont(900),
    fontSize: 25,
  },
  signIn: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  signInLabel: {
    fontFamily: roundedFont(800),
    fontSize: 12,
  },
  eyebrow: {
    fontFamily: roundedFont(800),
    fontSize: 12,
    lineHeight: 15.6,
    letterSpacing: 0.96,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: roundedFont(900),
    fontSize: 35,
    lineHeight: 37.8,
    marginTop: 10,
    marginBottom: 8,
  },
  body: { fontSize: 14, lineHeight: 21.7 },
  visual: {
    flexGrow: 1,
    minHeight: 340,
    overflow: "hidden",
    marginHorizontal: -20,
  },
  circle: {
    position: "absolute",
    width: 290,
    height: 290,
    right: -68,
    top: 25,
    borderRadius: 145,
  },
  mascot: {
    position: "absolute",
    width: 390,
    height: 400.72,
    left: -30,
    bottom: -26,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginVertical: 20,
  },
  dot: { width: 7, height: 7, borderRadius: 99 },
  activeDot: { width: 24 },
  activate: {
    minHeight: 52,
    borderRadius: 17,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: primaryGlow.boxShadow,
  },
  activateLabel: {
    fontFamily: roundedFont(800),
    fontSize: 14,
    textAlign: "center",
  },
});
