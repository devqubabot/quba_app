import { FoundationEmptyScreen } from "@/presentation/screens/FoundationEmptyScreen";

export default function ProfileRoute() {
  return (
    <FoundationEmptyScreen
      actionHref="/(tabs)"
      name="profile"
      showMascot={false}
    />
  );
}
