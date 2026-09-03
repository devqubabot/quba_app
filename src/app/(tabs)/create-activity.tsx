import { FoundationEmptyScreen } from "@/presentation/screens/FoundationEmptyScreen";

export default function CreateActivityRoute() {
  return (
    <FoundationEmptyScreen
      actionHref="/(tabs)"
      name="createActivity"
      showMascot={false}
    />
  );
}
