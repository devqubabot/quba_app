import { render, screen, userEvent } from "@testing-library/react-native";

import {
  onboardingFlowCopy,
  parseStarter,
} from "@/presentation/onboarding/flowCopy";
import {
  OnboardingFormScreen,
  type OnboardingFormKind,
} from "@/presentation/onboarding/OnboardingFormScreen";
import {
  FirstActivityScreen,
  PairingScreen,
  StarterScreen,
} from "@/presentation/onboarding/OnboardingSetupScreen";
import {
  OnboardingStepScreen,
  onboardingSteps,
  parseOnboardingStep,
} from "@/presentation/onboarding/OnboardingStepScreen";
import { PresentationProvider } from "@/presentation/theme/ThemeProvider";

const copy = onboardingFlowCopy.id;
async function form(kind: OnboardingFormKind) {
  const onContinue = jest.fn();
  const onBack = jest.fn();
  const onRecovery = jest.fn();
  await render(
    <PresentationProvider reduceMotionOverride>
      <OnboardingFormScreen
        kind={kind}
        onContinue={onContinue}
        onBack={onBack}
        onRecovery={onRecovery}
      />
    </PresentationProvider>,
  );
  return { user: userEvent.setup(), onContinue, onBack, onRecovery };
}

describe("Onboarding UI preview", () => {
  it.each(["id", "en"] as const)(
    "renders every step in both appearances with %s copy",
    async (locale) => {
      for (const appearance of ["light", "night"] as const) {
        for (const step of onboardingSteps) {
          const result = await render(
            <PresentationProvider
              initialLocale={locale}
              initialAppearancePreference={appearance}
              reduceMotionOverride
            >
              <OnboardingStepScreen
                step={step}
                starter="dzikir"
                onNavigate={jest.fn()}
                onBack={jest.fn()}
                onRestart={jest.fn()}
              />
            </PresentationProvider>,
          );
          expect(
            screen.getByText(onboardingFlowCopy[locale].preview),
          ).toBeOnTheScreen();
          expect(screen.getByRole("header")).toBeOnTheScreen();
          expect(
            screen.getByRole("button", {
              name: onboardingFlowCopy[locale].back,
            }),
          ).toBeOnTheScreen();
          await result.unmount();
        }
      }
    },
  );

  it.each(["example", "sample@example.com"])(
    "accepts %s for login without starting a session",
    async (identifier) => {
      const { user, onContinue } = await form("login");
      await user.press(screen.getByRole("button", { name: copy.login.action }));
      expect(onContinue).not.toHaveBeenCalled();
      expect(screen.getByLabelText(copy.identifier)).toHaveDisplayValue("");
      expect(screen.getAllByText(copy.required)).toHaveLength(2);
      await user.type(screen.getByLabelText(copy.identifier), identifier);
      await user.type(screen.getByLabelText(copy.password), "sample-password");
      await user.press(screen.getByRole("button", { name: copy.showPassword }));
      expect(
        screen.getByRole("button", { name: copy.hidePassword }),
      ).toBeOnTheScreen();
      await user.press(screen.getByRole("button", { name: copy.login.action }));
      expect(onContinue).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText(copy.password)).toHaveDisplayValue("");
    },
  );

  it("clears credentials when opening recovery and exposes back navigation", async () => {
    const { user, onRecovery, onBack } = await form("login");
    await user.type(screen.getByLabelText(copy.password), "sample-password");
    await user.press(screen.getByRole("button", { name: copy.recovery.label }));
    expect(onRecovery).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(copy.password)).toHaveDisplayValue("");
    await user.press(screen.getByRole("button", { name: copy.back }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("validates recovery email and never claims a message was sent", async () => {
    const { user, onContinue } = await form("recovery");
    await user.type(screen.getByLabelText(copy.email), "invalid");
    await user.press(
      screen.getByRole("button", { name: copy.recovery.action }),
    );
    expect(screen.getByText(copy.emailError)).toBeOnTheScreen();
    await user.clear(screen.getByLabelText(copy.email));
    await user.type(screen.getByLabelText(copy.email), "sample@example.com");
    await user.press(
      screen.getByRole("button", { name: copy.recovery.action }),
    );
    expect(screen.getByText(copy.recoveryResult)).toBeOnTheScreen();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("requires a code without inventing a backend format rule", async () => {
    const { user, onContinue } = await form("activation");
    await user.press(
      screen.getByRole("button", { name: copy.activation.action }),
    );
    expect(screen.getByText(copy.required)).toBeOnTheScreen();
    await user.type(screen.getByLabelText(copy.codeLabel), "EXAMPLE-CODE");
    await user.press(
      screen.getByRole("button", { name: copy.activation.action }),
    );
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("validates all account fields and clears the password on continuation", async () => {
    const { user, onContinue } = await form("account");
    await user.press(screen.getByRole("button", { name: copy.account.action }));
    expect(screen.getAllByText(copy.required)).toHaveLength(4);
    await user.type(screen.getByLabelText(copy.nickname), "Sample");
    await user.type(screen.getByLabelText(copy.username), "sample");
    await user.type(screen.getByLabelText(copy.email), "sample@example.com");
    await user.type(screen.getByLabelText(copy.password), "short");
    await user.press(screen.getByRole("button", { name: copy.account.action }));
    expect(screen.getByText(copy.passwordError)).toBeOnTheScreen();
    expect(onContinue).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText(copy.password), "-example");
    await user.press(screen.getByRole("button", { name: copy.account.action }));
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(copy.password)).toHaveDisplayValue("");
  });

  it("matches the prototype pairing sample while keeping it in preview mode", async () => {
    const onContinue = jest.fn();
    const user = userEvent.setup();
    await render(
      <PresentationProvider reduceMotionOverride>
        <PairingScreen onBack={jest.fn()} onContinue={onContinue} />
      </PresentationProvider>,
    );
    expect(screen.getByText(copy.deviceTitle)).toBeOnTheScreen();
    expect(screen.getByText(copy.deviceDescription)).toBeOnTheScreen();
    expect(screen.getByText(copy.deviceStatus)).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: copy.pairingHelp }));
    expect(screen.getByText(copy.pairingHelpText)).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: copy.pairing.action }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("defaults to the prototype Dzikir starter and passes only a template identifier", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    await render(
      <PresentationProvider reduceMotionOverride>
        <StarterScreen onBack={jest.fn()} onSelect={onSelect} />
      </PresentationProvider>,
    );
    expect(
      screen.getByRole("button", {
        name: copy.routines.dzikir.title,
        selected: true,
      }),
    ).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: copy.starter.action }));
    expect(onSelect).toHaveBeenCalledWith("dzikir");
    await user.press(
      screen.getByRole("button", { name: copy.routines.book.title }),
    );
    expect(
      screen.getByRole("button", {
        name: copy.routines.book.title,
        selected: true,
      }),
    ).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: copy.starter.action }));
    expect(onSelect).toHaveBeenCalledWith("book");
  });

  it("adapts the trial target and only simulates prototype completion", async () => {
    const onContinue = jest.fn();
    const user = userEvent.setup();
    await render(
      <PresentationProvider reduceMotionOverride>
        <FirstActivityScreen
          starter="book"
          onBack={jest.fn()}
          onContinue={onContinue}
        />
      </PresentationProvider>,
    );
    expect(
      screen.getByRole("header", { name: copy.routines.book.trial }),
    ).toBeOnTheScreen();
    expect(screen.getByText("20")).toBeOnTheScreen();
    expect(screen.getByText(copy.targetNote)).toBeOnTheScreen();
    await user.press(
      screen.getByRole("button", { name: copy.firstActivity.action }),
    );
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed route inputs and arbitrary template identifiers", () => {
    expect(parseOnboardingStep("login")).toBe("login");
    expect(parseOnboardingStep(["login"])).toBeUndefined();
    expect(parseOnboardingStep("../(tabs)")).toBeUndefined();
    expect(parseStarter("book")).toBe("book");
    expect(parseStarter("custom")).toBeUndefined();
    expect(parseStarter(["book"])).toBeUndefined();
  });
});
