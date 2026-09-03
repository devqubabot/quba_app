import { Image, type ImageProps } from "react-native";

import { usePresentation } from "@/presentation/theme/ThemeProvider";

type MascotVariant = "soft" | "physical" | "avatar";

interface QubaMascotProps extends Omit<
  ImageProps,
  "accessibilityLabel" | "source"
> {
  readonly accessibilityLabel?: string;
  readonly variant: MascotVariant;
}

const mascotSources = {
  soft: require("@/presentation/assets/mascots/soft-quba.png"),
  physical: require("@/presentation/assets/mascots/physical-quba.png"),
  avatar: require("@/presentation/assets/mascots/physical-quba-avatar.png"),
} as const;

export function QubaMascot({
  accessibilityLabel,
  style,
  variant,
  ...props
}: QubaMascotProps) {
  const { theme } = usePresentation();
  const size =
    variant === "soft"
      ? theme.mascotSizes.hero
      : variant === "physical"
        ? theme.mascotSizes.device
        : theme.mascotSizes.avatar;

  return (
    <Image
      accessibilityIgnoresInvertColors
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      resizeMode="contain"
      source={mascotSources[variant]}
      style={[{ height: size, width: size }, style]}
      {...props}
    />
  );
}
