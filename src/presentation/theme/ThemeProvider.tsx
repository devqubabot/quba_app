import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AccessibilityInfo,
  type ColorSchemeName,
  useColorScheme,
} from "react-native";

import { enMessages } from "@/presentation/copy/en";
import { idMessages } from "@/presentation/copy/id";
import type { Locale, Messages } from "@/presentation/copy/messages";
import {
  createTheme,
  type Appearance,
  type AppearancePreference,
  type QubaTheme,
} from "@/presentation/theme/tokens";

interface PresentationContextValue {
  readonly appearancePreference: AppearancePreference;
  readonly locale: Locale;
  readonly messages: Messages;
  readonly reduceMotion: boolean;
  readonly setAppearancePreference: (preference: AppearancePreference) => void;
  readonly setLocale: (locale: Locale) => void;
  readonly theme: QubaTheme;
}

interface PresentationProviderProps extends PropsWithChildren {
  readonly initialAppearancePreference?: AppearancePreference;
  readonly initialLocale?: Locale;
  readonly reduceMotionOverride?: boolean;
}

const PresentationContext = createContext<PresentationContextValue | null>(
  null,
);

export const defaultAppearancePreference: AppearancePreference = "light";

export function resolveAppearance(
  preference: AppearancePreference,
  systemAppearance: ColorSchemeName,
): Appearance {
  if (preference !== "system") return preference;
  return systemAppearance === "dark" ? "night" : "light";
}

export function PresentationProvider({
  children,
  initialAppearancePreference = defaultAppearancePreference,
  initialLocale = "id",
  reduceMotionOverride,
}: PresentationProviderProps) {
  const systemAppearance = useColorScheme();
  const [appearancePreference, setAppearancePreference] = useState(
    initialAppearancePreference,
  );
  const [locale, setLocale] = useState(initialLocale);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    if (reduceMotionOverride !== undefined) return;
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduceMotion,
    );
    return () => subscription.remove();
  }, [reduceMotionOverride]);

  const appearance = resolveAppearance(appearancePreference, systemAppearance);
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const messages = locale === "id" ? idMessages : enMessages;
  const value = useMemo<PresentationContextValue>(
    () => ({
      appearancePreference,
      locale,
      messages,
      reduceMotion,
      setAppearancePreference,
      setLocale,
      theme: createTheme(appearance),
    }),
    [appearance, appearancePreference, locale, messages, reduceMotion],
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation(): PresentationContextValue {
  const value = useContext(PresentationContext);
  if (!value)
    throw new Error("usePresentation must be used within PresentationProvider");
  return value;
}
