import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppIcon, type AppIconName } from "@/presentation/components/AppIcon";
import { Button } from "@/presentation/components/Button";
import { QubaMascot } from "@/presentation/components/QubaMascot";
import { QubaText } from "@/presentation/components/QubaText";
import {
  onboardingFlowCopy,
  starterIds,
  type StarterId,
} from "@/presentation/onboarding/flowCopy";
import {
  OnboardingAction,
  OnboardingFrame,
} from "@/presentation/onboarding/OnboardingFrame";
import { usePresentation } from "@/presentation/theme/ThemeProvider";
import { deviceSample, roundedFont } from "@/presentation/theme/tokens";

interface SetupProps {
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

export function PairingScreen({ onBack, onContinue }: SetupProps) {
  const { locale, theme } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  const [help, setHelp] = useState(false);
  return (
    <OnboardingFrame {...copy.pairing} centered onBack={onBack}>
      <View style={[styles.orbit, { borderColor: theme.colors.surfaceAccent }]}>
        <View
          style={[
            styles.orbitCore,
            { backgroundColor: theme.colors.surfaceAccent },
          ]}
        >
          <QubaMascot variant="physical" style={styles.device} />
        </View>
      </View>
      <View
        style={[
          styles.deviceCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.lg,
          },
        ]}
      >
        <View style={[styles.deviceFace, { borderRadius: theme.radii.sm }]}>
          <AppIcon
            name="robot-happy-outline"
            color={deviceSample.led}
            size={24}
          />
        </View>
        <View style={styles.grow}>
          <QubaText variant="label">{copy.deviceTitle}</QubaText>
          <QubaText variant="caption" color="muted">
            {copy.deviceDescription}
          </QubaText>
        </View>
        <View
          style={[
            styles.status,
            {
              backgroundColor: theme.colors.primarySoft,
              borderColor: theme.colors.primaryStrong,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: theme.colors.primaryStrong },
            ]}
          />
          <QubaText color="primary" variant="caption">
            {copy.deviceStatus}
          </QubaText>
        </View>
      </View>
      <OnboardingAction label={copy.pairing.action} onPress={onContinue} />
      <Button
        label={copy.pairingHelp}
        variant="secondary"
        accessibilityState={{ expanded: help }}
        onPress={() => setHelp(!help)}
        style={styles.textButton}
      />
      {help ? (
        <QubaText
          accessibilityLiveRegion="polite"
          color="muted"
          variant="caption"
        >
          {copy.pairingHelpText}
        </QubaText>
      ) : null}
    </OnboardingFrame>
  );
}

const routineIcons: Record<StarterId, AppIconName> = {
  dzikir: "counter",
  quran: "book-open-page-variant-outline",
  shalat: "mosque",
  book: "book-outline",
};

export function StarterScreen({
  onBack,
  onSelect,
  initialSelection,
}: {
  readonly onBack: () => void;
  readonly onSelect: (id: StarterId) => void;
  readonly initialSelection?: StarterId;
}) {
  const { locale, theme } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  const [selection, setSelection] = useState<StarterId>(
    initialSelection ?? "dzikir",
  );
  const [error, setError] = useState(false);
  return (
    <OnboardingFrame {...copy.starter} onBack={onBack}>
      <View style={styles.options}>
        {starterIds.map((id) => {
          const selected = selection === id;
          const routine = copy.routines[id];
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={routine.title}
              accessibilityHint={routine.description}
              accessibilityState={{ selected }}
              onPress={() => {
                setSelection(id);
                setError(false);
              }}
              style={[
                styles.option,
                {
                  borderRadius: theme.radii.md,
                  backgroundColor: selected
                    ? theme.colors.primarySoft
                    : theme.colors.surface,
                  borderColor: selected
                    ? theme.colors.primaryStrong
                    : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.optionIcon,
                  {
                    backgroundColor: theme.colors.surfaceAccent,
                    borderRadius: theme.radii.sm,
                  },
                ]}
              >
                <AppIcon name={routineIcons[id]} size={28} />
              </View>
              <View style={styles.grow}>
                <QubaText style={styles.optionTitle}>{routine.title}</QubaText>
                <QubaText variant="caption" color="muted">
                  {routine.description}
                </QubaText>
              </View>
              <AppIcon
                name={selected ? "check-circle" : "circle-outline"}
                color={
                  selected ? theme.colors.primaryStrong : theme.colors.textMuted
                }
              />
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <QubaText color="danger" accessibilityLiveRegion="polite">
          {copy.chooseStarter}
        </QubaText>
      ) : null}
      <OnboardingAction
        label={copy.starter.action}
        onPress={() => {
          if (selection) onSelect(selection);
          else setError(true);
        }}
      />
    </OnboardingFrame>
  );
}

export function FirstActivityScreen({
  starter,
  onBack,
  onContinue,
}: SetupProps & { readonly starter?: StarterId }) {
  const { locale } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  const routine = starter ? copy.routines[starter] : undefined;
  return (
    <OnboardingFrame
      {...copy.firstActivity}
      title={routine?.trial ?? copy.noSelection}
      centered
      onBack={onBack}
    >
      {routine ? (
        <>
          <View style={styles.centered}>
            <QubaText style={styles.target}>{routine.target}</QubaText>
            <QubaText variant="label">{routine.unit}</QubaText>
            <QubaText variant="caption" color="muted" style={styles.centerText}>
              {copy.targetNote}
            </QubaText>
          </View>
          <QubaMascot variant="soft" style={styles.trialMascot} />
          <OnboardingAction
            label={copy.firstActivity.action}
            onPress={onContinue}
          />
        </>
      ) : (
        <OnboardingAction label={copy.starter.title} onPress={onBack} />
      )}
    </OnboardingFrame>
  );
}

export function OnboardingCompleteScreen({
  login,
  onRestart,
}: {
  readonly login: boolean;
  readonly onRestart: () => void;
}) {
  const { locale } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  const page = login ? copy.loginComplete : copy.complete;
  return (
    <OnboardingFrame
      label={copy.complete.label}
      title={page.title}
      description={page.description}
      centered
      onBack={onRestart}
    >
      <QubaMascot variant="soft" style={styles.trialMascot} />
      <OnboardingAction label={copy.complete.action} onPress={onRestart} />
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  orbit: {
    width: 250,
    height: 250,
    maxWidth: "100%",
    alignSelf: "center",
    borderRadius: 125,
    borderWidth: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  orbitCore: {
    width: 174,
    height: 174,
    borderRadius: 87,
    alignItems: "center",
    justifyContent: "center",
  },
  device: { width: 190, height: 190, marginTop: 18 },
  deviceCard: {
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deviceFace: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: deviceSample.screen,
  },
  status: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
  },
  statusDot: { width: 6, height: 6, borderRadius: 999 },
  grow: { flex: 1, gap: 4 },
  textButton: { backgroundColor: "transparent" },
  options: { gap: 12 },
  option: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
  },
  optionIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: { fontFamily: roundedFont(800), fontSize: 17 },
  centered: { alignItems: "center", gap: 8 },
  centerText: { textAlign: "center" },
  target: {
    fontFamily: roundedFont(900),
    fontSize: 82,
    lineHeight: 90,
    fontVariant: ["tabular-nums"],
  },
  trialMascot: { width: 220, height: 226, alignSelf: "center" },
});
