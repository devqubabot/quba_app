import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { Button } from "@/presentation/components/Button";
import { IconButton } from "@/presentation/components/IconButton";
import { ProgressBar } from "@/presentation/components/ProgressBar";
import { QubaMascot } from "@/presentation/components/QubaMascot";
import { SegmentedControl } from "@/presentation/components/SegmentedControl";
import { TextField } from "@/presentation/components/TextField";
import { PresentationProvider } from "@/presentation/theme/ThemeProvider";

async function renderControls(reduceMotion = true) {
  const onChange = jest.fn();
  const onPress = jest.fn();
  await render(
    <PresentationProvider reduceMotionOverride={reduceMotion}>
      <Button label="Save" onPress={onPress} testID="button" />
      <IconButton
        accessibilityLabel="Close panel"
        icon="close"
        onPress={onPress}
        testID="icon-button"
      />
      <TextField
        error="Use at least 3 characters"
        label="Habit name"
        value="A"
      />
      <ProgressBar label="Daily progress" value={0.4} />
      <QubaMascot accessibilityLabel="Quba device" variant="physical" />
      <SegmentedControl
        accessibilityLabel="Activity type"
        onChange={onChange}
        options={[
          { label: "Session", value: "session" },
          { label: "Counter", value: "counter" },
        ]}
        value="session"
      />
    </PresentationProvider>,
  );
  return { onChange, onPress };
}

describe("shared production controls", () => {
  it("exposes accessible names, roles, states, and 44-point targets", async () => {
    const { onChange, onPress } = await renderControls();
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    await fireEvent.press(screen.getByRole("button", { name: "Close panel" }));
    await fireEvent.press(screen.getByRole("tab", { name: "Counter" }));
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith("counter");
    expect(
      screen.getByRole("tab", { name: "Session", selected: true }),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText("Daily progress").props.accessibilityValue,
    ).toMatchObject({ now: 40 });
    expect(screen.getByLabelText("Habit name").props.accessibilityHint).toBe(
      "Use at least 3 characters",
    );
    expect(
      StyleSheet.flatten(screen.getByTestId("button").props.style).minHeight,
    ).toBeGreaterThanOrEqual(44);
    expect(
      StyleSheet.flatten(screen.getByTestId("icon-button").props.style)
        .minWidth,
    ).toBeGreaterThanOrEqual(44);
    expect(screen.getByLabelText("Quba device")).toBeOnTheScreen();
  });

  it("does not scale button feedback when reduced motion is enabled", async () => {
    await renderControls(true);
    await fireEvent(screen.getByTestId("button"), "pressIn");
    expect(
      StyleSheet.flatten(screen.getByTestId("button").props.style).transform,
    ).toBeUndefined();
  });
});
