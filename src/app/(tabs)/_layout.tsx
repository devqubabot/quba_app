import { Tabs } from "expo-router";
import { Pressable } from "react-native";

import { AppIcon } from "@/presentation/components/AppIcon";
import { resolveTabIcon, tabRoutes } from "@/presentation/navigation/tabRoutes";
import { usePresentation } from "@/presentation/theme/ThemeProvider";
import { roundedFont } from "@/presentation/theme/tokens";

export default function SignedInTabsLayout() {
  const { messages, reduceMotion, theme } = usePresentation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryStrong,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarAllowFontScaling: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: roundedFont(600),
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          minHeight: 76,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {tabRoutes.slice(0, 2).map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: messages.shell.tabs[route.messageKey],
            tabBarAccessibilityLabel: messages.shell.tabs[route.messageKey],
            tabBarIcon: ({ color, focused, size }) => (
              <AppIcon
                color={color}
                name={resolveTabIcon(route, focused)}
                size={size}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="create-activity"
        options={{
          title: messages.shell.createActivity,
          tabBarAccessibilityLabel: messages.shell.createActivity,
          tabBarIcon: ({ color }) => (
            <AppIcon color={color} name="plus" size={theme.iconSizes.lg} />
          ),
          tabBarButton: ({ children, ref: _ref, style: _style, ...props }) => (
            <Pressable
              {...props}
              style={({ pressed }) => ({
                alignItems: "center",
                backgroundColor: pressed
                  ? theme.colors.primaryPressed
                  : theme.colors.primary,
                borderRadius: 999,
                height: 56,
                justifyContent: "center",
                marginTop: -18,
                minWidth: 56,
                transform:
                  pressed && !reduceMotion
                    ? [{ scale: theme.motion.pressScale }]
                    : undefined,
              })}
            >
              {children}
            </Pressable>
          ),
          tabBarLabelStyle: {
            color: theme.colors.onPrimary,
            fontFamily: roundedFont(700),
            fontSize: 10,
          },
        }}
      />
      {tabRoutes.slice(2).map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: messages.shell.tabs[route.messageKey],
            tabBarAccessibilityLabel: messages.shell.tabs[route.messageKey],
            tabBarIcon: ({ color, focused, size }) => (
              <AppIcon
                color={color}
                name={resolveTabIcon(route, focused)}
                size={size}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
