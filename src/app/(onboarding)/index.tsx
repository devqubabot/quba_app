import { router, type Href } from "expo-router";

import { OnboardingScreen } from "@/presentation/onboarding/OnboardingScreen";

export default function OnboardingRoute() {
  return (
    <OnboardingScreen
      onContinue={() => router.push("/(onboarding)/activation" as Href)}
      onSignIn={() => router.push("/(onboarding)/login" as Href)}
    />
  );
}
