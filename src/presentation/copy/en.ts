import type { Messages } from "@/presentation/copy/messages";

export const enMessages: Messages = {
  common: { back: "Back", cancel: "Cancel", close: "Close" },
  shell: {
    activeActivity: "Active activity",
    createActivity: "Create activity",
    tabs: {
      home: "Home",
      habits: "Habits",
      quba: "Quba",
      statistics: "Statistics",
      profile: "Profile",
    },
  },
  onboarding: {
    signIn: "Sign in",
    eyebrow: "Your companion for growth",
    mascotLabel: "Quba greets you cheerfully",
    stepLabel: "Step 1 of 3",
    title: "Start an activity without getting lost in a screen.",
    description:
      "Set up routines in the app, then let Quba keep you company when it is time to get moving.",
    action: "Activate Quba",
  },
  empty: {
    home: {
      title: "Today is still open.",
      description:
        "Your daily activities and progress will appear here after you create your first habit.",
      action: "View habits",
    },
    habits: {
      title: "No habits yet.",
      description:
        "Create a simple routine for a checklist, counter, or session.",
      action: "Create habit",
    },
    quba: {
      title: "Quba is not connected.",
      description:
        "Connection and sync status will appear here when pairing is available.",
      action: "Learn about connecting Quba",
    },
    statistics: {
      title: "No progress to summarize yet.",
      description:
        "Your weekly summary will appear after you complete an activity.",
      action: "Return home",
    },
    profile: {
      title: "Profile settings are not available yet.",
      description:
        "Language, theme, sound, and version information will be managed here.",
      action: "Return home",
    },
    createActivity: {
      title: "Create a quick activity.",
      description:
        "Session and Counter choices will be available in the next feature stage.",
      action: "Close",
    },
    activeActivity: {
      title: "No activity is running.",
      description:
        "When an activity is running, you can return here from anywhere.",
      action: "Create activity",
    },
    habitDetail: {
      title: "Habit details are not available yet.",
      description:
        "Streak, activity totals, and the weekly calendar will appear here.",
      action: "Return to habits",
    },
  },
  controls: {
    fieldError: "Check this field and try again.",
    progressLabel: "Progress",
  },
};
