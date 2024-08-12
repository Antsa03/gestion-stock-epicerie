import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Header from "@/components/Header";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tableau",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "analytics" : "analytics-outline"}
              color={color}
            />
          ),
          header: () => <Header title="Tableau de Bord" />,
        }}
      />

      <Tabs.Screen
        name="produits"
        options={{
          title: "Produits",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "create" : "create-outline"}
              color={color}
            />
          ),
          header: () => <Header title="Catalogue des produits" />,
        }}
      />

      <Tabs.Screen
        name="entrees"
        options={{
          title: "Entrées",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "add" : "add-outline"} color={color} />
          ),
          header: () => <Header title="Gestion des Arrivages" />,
        }}
      />

      <Tabs.Screen
        name="sorties"
        options={{
          title: "Sorties",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
            />
          ),
          header: () => <Header title="Gestion des Ventes" />,
        }}
      />
    </Tabs>
  );
}
