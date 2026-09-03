import { FoundationEmptyScreen } from "@/presentation/screens/FoundationEmptyScreen";

export default function HabitDetailRoute() {
  return (
    <FoundationEmptyScreen
      actionHref="/(tabs)/habits"
      name="habitDetail"
      showMascot={false}
    />
  );
}
