import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: { backgroundColor: Colors[colorScheme].card },
        headerStyle: { backgroundColor: Colors[colorScheme].background },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <SymbolView name="house.fill" tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="drawer"
        options={{
          title: "서랍",
          tabBarIcon: ({ color }) => (
            <SymbolView name="archivebox.fill" tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.3.fill" tintColor={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => (
            <SymbolView name="gearshape.fill" tintColor={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
