import { fireEvent, render, screen } from "@testing-library/react-native";

import { enMessages } from "@/presentation/copy/en";
import { idMessages } from "@/presentation/copy/id";
import { HomeScreen } from "@/presentation/home/HomeScreen";
import { PresentationProvider } from "@/presentation/theme/ThemeProvider";

describe("HomeScreen", () => {
  it.each([
    ["id", idMessages],
    ["en", enMessages],
  ] as const)(
    "shows complete %s empty-state copy and opens habits",
    async (locale, messages) => {
      const onOpenHabits = jest.fn();
      await render(
        <PresentationProvider initialLocale={locale} reduceMotionOverride>
          <HomeScreen onOpenHabits={onOpenHabits} />
        </PresentationProvider>,
      );

      expect(
        screen.getByRole("header", { name: messages.empty.home.title }),
      ).toBeOnTheScreen();
      expect(
        screen.getByText(messages.empty.home.description),
      ).toBeOnTheScreen();
      await fireEvent.press(
        screen.getByRole("button", { name: messages.empty.home.action }),
      );
      expect(onOpenHabits).toHaveBeenCalledTimes(1);
    },
  );
});
