import { type Href, useRouter } from "expo-router";

import { EmptyState } from "@/presentation/components/EmptyState";
import { Screen } from "@/presentation/components/Screen";
import type { Messages } from "@/presentation/copy/messages";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

type EmptyScreenName = keyof Messages["empty"];

interface FoundationEmptyScreenProps {
  readonly actionHref?:
    "/(tabs)" | "/(tabs)/habits" | "/(tabs)/create-activity";
  readonly name: EmptyScreenName;
  readonly showMascot?: boolean;
}

export function FoundationEmptyScreen({
  actionHref,
  name,
  showMascot,
}: FoundationEmptyScreenProps) {
  const router = useRouter();
  const { messages } = usePresentation();
  return (
    <Screen>
      <EmptyState
        message={messages.empty[name]}
        onAction={
          actionHref ? () => router.replace(actionHref as Href) : undefined
        }
        showMascot={showMascot}
      />
    </Screen>
  );
}
