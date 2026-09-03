import type { TextStyle, ViewStyle } from "react-native";

export type Appearance = "light" | "night";
export type AppearancePreference = "system" | Appearance;

export interface QubaColors {
  readonly background: string;
  readonly surface: string;
  readonly surfaceSoft: string;
  readonly surfaceAccent: string;
  readonly text: string;
  readonly textMuted: string;
  readonly primary: string;
  readonly primaryPressed: string;
  readonly primarySoft: string;
  readonly primaryStrong: string;
  readonly onPrimary: string;
  readonly border: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly focus: string;
  readonly overlay: string;
}

const sharedColors = {
  primary: "#BAFF72",
  primaryPressed: "#A3E95D",
} as const;

export const colors: Record<Appearance, QubaColors> = {
  light: {
    ...sharedColors,
    background: "#FFFAF4",
    surface: "#FFFFFF",
    surfaceSoft: "#F5F0FB",
    surfaceAccent: "#EEE9FF",
    text: "#171341",
    textMuted: "#5F596F",
    primarySoft: "#ECFFD8",
    primaryStrong: "#3E681B",
    onPrimary: "#171341",
    border: "#DED9E4",
    success: "#0C7568",
    warning: "#9A5700",
    danger: "#A82F39",
    focus: "#5137C8",
    overlay: "rgba(23, 19, 65, 0.48)",
  },
  night: {
    ...sharedColors,
    background: "#121022",
    surface: "#211D36",
    surfaceSoft: "#29243E",
    surfaceAccent: "#302754",
    text: "#FAF7FF",
    textMuted: "#C7C0D8",
    primarySoft: "#293A1D",
    primaryStrong: "#D5FFAA",
    onPrimary: "#142111",
    border: "#47405D",
    success: "#67D6C3",
    warning: "#FFB866",
    danger: "#FF8790",
    focus: "#D5FFAA",
    overlay: "rgba(0, 0, 0, 0.68)",
  },
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
export const radii = { sm: 12, md: 18, lg: 24, xl: 30, pill: 999 } as const;

// Quba bundles the Nunito rounded typeface (SIL OFL) so every platform renders
// the same rounded family. Android cannot vary a custom font by fontWeight, so
// each weight ships as its own face and styles pick the face by family. Faces
// are loaded with expo-font before first paint in src/app/_layout.tsx.
// Nunito supports 200-900, so display styles at 800/900 get their own faces.
export const fontFamilies = {
  rounded: {
    regular: "Nunito-Regular",
    medium: "Nunito-Medium",
    semibold: "Nunito-SemiBold",
    bold: "Nunito-Bold",
    extrabold: "Nunito-ExtraBold",
    black: "Nunito-Black",
  },
} as const;

/** Map a requested CSS weight to the nearest bundled Nunito face. */
export function roundedFont(weight: number): string {
  if (weight >= 900) return fontFamilies.rounded.black;
  if (weight >= 800) return fontFamilies.rounded.extrabold;
  if (weight >= 700) return fontFamilies.rounded.bold;
  if (weight >= 600) return fontFamilies.rounded.semibold;
  if (weight >= 500) return fontFamilies.rounded.medium;
  return fontFamilies.rounded.regular;
}

const baseText = {
  includeFontPadding: false,
  letterSpacing: 0,
} as const satisfies TextStyle;

export const typography = {
  display: {
    ...baseText,
    fontFamily: roundedFont(800),
    fontSize: 40,
    lineHeight: 44,
  },
  title: {
    ...baseText,
    fontFamily: roundedFont(800),
    fontSize: 28,
    lineHeight: 34,
  },
  heading: {
    ...baseText,
    fontFamily: roundedFont(800),
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    ...baseText,
    fontFamily: roundedFont(400),
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    ...baseText,
    fontFamily: roundedFont(700),
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    ...baseText,
    fontFamily: roundedFont(500),
    fontSize: 13,
    lineHeight: 18,
  },
} as const satisfies Record<string, TextStyle>;

export const elevation = {
  card: { boxShadow: "0 10px 28px rgba(38, 27, 88, 0.07)", elevation: 2 },
  floating: { boxShadow: "0 18px 46px rgba(38, 27, 88, 0.15)", elevation: 8 },
} as const satisfies Record<string, ViewStyle>;

export const iconSizes = { sm: 18, md: 22, lg: 28 } as const;
export const mascotSizes = { avatar: 96, device: 224, hero: 256 } as const;
export const touchTargets = { minimum: 44, comfortable: 52 } as const;
export const motion = {
  instant: 0,
  quick: 150,
  standard: 240,
  pressScale: 0.96,
} as const;

// Warm orange for the Character Pop "Quba!" exclamation mark.
export const brandExclamation = {
  light: "#FF982F",
  night: "#FFAE54",
} as const;

// screen-welcome hero emphasis roles mirroring the approved prototype. They
// stay here as named tokens (not literals inside the screen) so feature
// components carry no raw visual values; exact hex intentionally matches the
// prototype and is the documented location for the welcome art direction.
export const welcomeHero = {
  mutedText: { light: "#736E89", night: "#B7B0CA" } as const,
  interactiveText: { light: "#2C5A18", night: "#BAFF72" } as const,
  progressActive: { light: "#4C7A24", night: "#D5FFAA" } as const,
} as const;

// Green glow behind the lime primary action; identical on both appearances.
export const primaryGlow = {
  boxShadow: "0 12px 24px rgba(89, 130, 43, 0.22)",
} as const satisfies ViewStyle;

// Sample-device illustration colors for the pairing screen. The device is a
// physical object, so the same face/screen and LED tones render in both themes.
export const deviceSample = {
  screen: "#18162B",
  led: "#5DF0DC",
} as const;

/** Resolve a light/night variant for a `{ light, night }` color pair. */
export function tone(
  pair: { readonly light: string; readonly night: string },
  appearance: Appearance,
): string {
  return appearance === "night" ? pair.night : pair.light;
}

export interface QubaTheme {
  readonly appearance: Appearance;
  readonly colors: QubaColors;
  readonly spacing: typeof spacing;
  readonly radii: typeof radii;
  readonly typography: typeof typography;
  readonly elevation: typeof elevation;
  readonly iconSizes: typeof iconSizes;
  readonly mascotSizes: typeof mascotSizes;
  readonly touchTargets: typeof touchTargets;
  readonly motion: typeof motion;
}

export function createTheme(appearance: Appearance): QubaTheme {
  return {
    appearance,
    colors: colors[appearance],
    spacing,
    radii,
    typography,
    elevation,
    iconSizes,
    mascotSizes,
    touchTargets,
    motion,
  };
}
