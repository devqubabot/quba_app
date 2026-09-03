import { OnboardingFormScreen } from "@/presentation/onboarding/OnboardingFormScreen";
import {
  OnboardingCompleteScreen,
  FirstActivityScreen,
  PairingScreen,
  StarterScreen,
} from "@/presentation/onboarding/OnboardingSetupScreen";
import type { StarterId } from "@/presentation/onboarding/flowCopy";

export const onboardingSteps = [
  "login",
  "recovery",
  "activation",
  "account",
  "pairing",
  "starter",
  "first-activity",
  "complete",
  "login-complete",
] as const;
export type OnboardingStep = (typeof onboardingSteps)[number];
export function parseOnboardingStep(
  value: unknown,
): OnboardingStep | undefined {
  return onboardingSteps.find((step) => step === value);
}

interface StepProps {
  readonly step: OnboardingStep;
  readonly starter?: StarterId;
  readonly onNavigate: (step: OnboardingStep, starter?: StarterId) => void;
  readonly onBack: () => void;
  readonly onRestart: () => void;
}

export function OnboardingStepScreen({
  step,
  starter,
  onNavigate,
  onBack,
  onRestart,
}: StepProps) {
  switch (step) {
    case "login":
    case "recovery":
    case "activation":
    case "account":
      return (
        <OnboardingFormScreen
          key={step}
          kind={step}
          onBack={onBack}
          onRecovery={() => onNavigate("recovery")}
          onContinue={() =>
            onNavigate(
              step === "login"
                ? "login-complete"
                : step === "activation"
                  ? "account"
                  : "pairing",
            )
          }
        />
      );
    case "pairing":
      return (
        <PairingScreen
          onBack={onBack}
          onContinue={() => onNavigate("starter")}
        />
      );
    case "starter":
      return (
        <StarterScreen
          initialSelection={starter}
          onBack={onBack}
          onSelect={(id) => onNavigate("first-activity", id)}
        />
      );
    case "first-activity":
      return (
        <FirstActivityScreen
          starter={starter}
          onBack={onBack}
          onContinue={() => onNavigate("complete")}
        />
      );
    case "complete":
    case "login-complete":
      return (
        <OnboardingCompleteScreen
          login={step === "login-complete"}
          onRestart={onRestart}
        />
      );
  }
}
