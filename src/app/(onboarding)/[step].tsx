import { Redirect, router, useLocalSearchParams, type Href } from "expo-router";

import { parseStarter } from "@/presentation/onboarding/flowCopy";
import {
  OnboardingStepScreen,
  parseOnboardingStep,
  type OnboardingStep,
} from "@/presentation/onboarding/OnboardingStepScreen";

export default function OnboardingStepRoute() {
  const params = useLocalSearchParams<{
    step?: string | string[];
    starter?: string | string[];
  }>();
  const step = parseOnboardingStep(params.step);
  const starter = parseStarter(params.starter);
  if (!step) return <Redirect href={"/(onboarding)" as Href} />;
  const navigate = (next: OnboardingStep, selected = starter) =>
    router.push(
      `/(onboarding)/${next}${selected ? `?starter=${selected}` : ""}` as Href,
    );
  const restart = () => {
    router.dismissAll();
    router.replace("/(onboarding)" as Href);
  };
  return (
    <OnboardingStepScreen
      key={step}
      step={step}
      starter={starter}
      onNavigate={navigate}
      onRestart={restart}
      onBack={() => {
        if (router.canGoBack()) router.back();
        else router.replace("/(onboarding)" as Href);
      }}
    />
  );
}
