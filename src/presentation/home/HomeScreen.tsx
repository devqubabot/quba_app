import { EmptyState } from "@/presentation/components/EmptyState";
import { Screen } from "@/presentation/components/Screen";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface HomeScreenProps {
  readonly onOpenHabits: () => void;
}

export function HomeScreen({ onOpenHabits }: HomeScreenProps) {
  const { messages } = usePresentation();

  return (
    <Screen>
      <EmptyState message={messages.empty.home} onAction={onOpenHabits} />
    </Screen>
  );
}
