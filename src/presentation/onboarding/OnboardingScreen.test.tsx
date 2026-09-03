import { render, screen, userEvent } from "@testing-library/react-native";

import { enMessages } from "@/presentation/copy/en";
import { idMessages } from "@/presentation/copy/id";
import { OnboardingScreen } from "@/presentation/onboarding/OnboardingScreen";
import { PresentationProvider } from "@/presentation/theme/ThemeProvider";

describe("Character Pop welcome", () => {
  it.each([
    ["id", "light", idMessages],
    ["id", "night", idMessages],
    ["en", "light", enMessages],
    ["en", "night", enMessages],
  ] as const)(
    "shows the welcome hierarchy in %s/%s",
    async (locale, appearance, messages) => {
      const user = userEvent.setup();
      const activate = jest.fn();
      const signIn = jest.fn();
      await render(
        <PresentationProvider
          initialLocale={locale}
          initialAppearancePreference={appearance}
          reduceMotionOverride
        >
          <OnboardingScreen onContinue={activate} onSignIn={signIn} />
        </PresentationProvider>,
      );
      expect(
        screen.getByRole("header", { name: messages.onboarding.title }),
      ).toBeOnTheScreen();
      expect(screen.getByText(messages.onboarding.eyebrow)).toBeOnTheScreen();
      expect(
        screen.getByLabelText(messages.onboarding.stepLabel),
      ).toBeOnTheScreen();
      await user.press(
        screen.getByRole("button", { name: messages.onboarding.action }),
      );
      await user.press(
        screen.getByRole("button", { name: messages.onboarding.signIn }),
      );
      expect(activate).toHaveBeenCalledTimes(1);
      expect(signIn).toHaveBeenCalledTimes(1);
    },
  );
});
