import { render, screen } from "@testing-library/react-native";

import { idCopy } from "@/presentation/copy/id";
import { HomeScreen } from "@/presentation/home/HomeScreen";

describe("HomeScreen", () => {
  it("shows the accessible foundation status and heading", async () => {
    await render(<HomeScreen />);

    expect(
      screen.getByRole("summary", { name: idCopy.foundation.statusLabel }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("header", { name: idCopy.foundation.title }),
    ).toBeOnTheScreen();
  });
});
