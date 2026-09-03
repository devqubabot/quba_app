import { type Href, useRouter } from "expo-router";

import { HomeScreen } from "@/presentation/home/HomeScreen";

export default function HomeRoute() {
  const router = useRouter();
  return (
    <HomeScreen onOpenHabits={() => router.push("/(tabs)/habits" as Href)} />
  );
}
