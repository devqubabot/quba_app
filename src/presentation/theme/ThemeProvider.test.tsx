import { render, screen } from "@testing-library/react-native";
import * as ReactNative from "react-native";

import { QubaText } from "@/presentation/components/QubaText";
import {
  PresentationProvider,
  defaultAppearancePreference,
  resolveAppearance,
  usePresentation,
} from "@/presentation/theme/ThemeProvider";

function ThemeProbe() {
  const { appearancePreference, reduceMotion, theme } = usePresentation();
  return (
    <QubaText testID="theme-probe">
      {`${appearancePreference}->${theme.appearance}:${theme.colors.background}:${reduceMotion}`}
    </QubaText>
  );
}

describe("PresentationProvider", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resolves system and explicit appearances", () => {
    expect(resolveAppearance("system", "dark")).toBe("night");
    expect(resolveAppearance("system", "light")).toBe("light");
    expect(resolveAppearance("light", "dark")).toBe("light");
    expect(resolveAppearance("night", "light")).toBe("night");
  });

  it("uses light as the default app appearance", async () => {
    jest.spyOn(ReactNative, "useColorScheme").mockReturnValue("dark");

    await render(
      <PresentationProvider reduceMotionOverride={false}>
        <ThemeProbe />
      </PresentationProvider>,
    );

    expect(defaultAppearancePreference).toBe("light");
    expect(screen.getByTestId("theme-probe")).toHaveTextContent(
      "light->light:#FFFAF4:false",
    );
  });

  it("exposes the night palette and reduced-motion preference", async () => {
    await render(
      <PresentationProvider
        initialAppearancePreference="night"
        reduceMotionOverride
      >
        <ThemeProbe />
      </PresentationProvider>,
    );
    expect(screen.getByTestId("theme-probe")).toHaveTextContent(
      "night->night:#121022:true",
    );
  });
});
