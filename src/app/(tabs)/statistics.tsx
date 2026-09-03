import { FoundationEmptyScreen } from "@/presentation/screens/FoundationEmptyScreen";

export default function StatisticsRoute() {
  return (
    <FoundationEmptyScreen
      actionHref="/(tabs)"
      name="statistics"
      showMascot={false}
    />
  );
}
