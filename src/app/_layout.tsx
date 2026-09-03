import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  PresentationProvider,
  usePresentation,
} from "@/presentation/theme/ThemeProvider";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/presentation/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Medium": require("@/presentation/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("@/presentation/assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("@/presentation/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("@/presentation/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Black": require("@/presentation/assets/fonts/Nunito-Black.ttf"),
  });

  if (!fontsLoaded) {
    // Hold the native splash until the rounded typeface is ready so text
    // never flashes in a fallback font.
    return null;
  }

  return (
    <PresentationProvider>
      <RootNavigator />
    </PresentationProvider>
  );
}

function RootNavigator() {
  const { theme } = usePresentation();
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="activity/active"
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack>
      <StatusBar style={theme.appearance === "night" ? "light" : "dark"} />
    </>
  );
}
