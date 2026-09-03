import { colors, fontFamilies, typography } from "@/presentation/theme/tokens";

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const channels = hex.match(/[A-Fa-f0-9]{2}/g);
  if (!channels || channels.length < 3)
    throw new Error(`Expected a six-digit hex color, received ${hex}`);
  const [red = "00", green = "00", blue = "00"] = channels;
  return (
    0.2126 * linearize(Number.parseInt(red, 16)) +
    0.7152 * linearize(Number.parseInt(green, 16)) +
    0.0722 * linearize(Number.parseInt(blue, 16))
  );
}

function contrast(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
}

describe("semantic color tokens", () => {
  it.each(["light", "night"] as const)(
    "keeps essential %s text pairs at WCAG AA contrast",
    (appearance) => {
      const palette = colors[appearance];
      const pairs = [
        [palette.text, palette.background],
        [palette.textMuted, palette.background],
        [palette.text, palette.surface],
        [palette.onPrimary, palette.primary],
        [palette.primaryStrong, palette.primarySoft],
        [palette.danger, palette.surface],
      ] as const;
      expect(
        pairs.every(
          ([foreground, background]) => contrast(foreground, background) >= 4.5,
        ),
      ).toBe(true);
    },
  );
});

describe("semantic typography tokens", () => {
  it("uses bundled Nunito rounded faces and neutral tracking across text roles", () => {
    const allowed: ReadonlySet<string> = new Set(
      Object.values(fontFamilies.rounded),
    );

    expect(
      Object.values(typography).every((variant) =>
        allowed.has(variant.fontFamily ?? ""),
      ),
    ).toBe(true);
    expect(
      Object.values(typography).every((variant) => variant.letterSpacing === 0),
    ).toBe(true);
  });
});
