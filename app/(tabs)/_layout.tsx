import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarHideOnKeyboard: true,
          freezeOnBlur: true,
          // animation: 'shift',
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ble Scanner",
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].backgroundLight,
              boxShadow: "0px 0px 0px #000",
            },
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerBackTitleStyle: {
              fontSize: 14,
              fontFamily: "MontserratBold",
            },
            headerTitleStyle: {
              textAlign: "center",
              fontFamily: "MontserratBold",
            },
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="tower-broadcast" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].backgroundLight,
              boxShadow: "0px 0px 0px #000",
            },
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerBackTitleStyle: {
              fontSize: 14,
              fontFamily: "MontserratBold",
            },
            headerTitleStyle: {
              textAlign: "center",
              fontFamily: "MontserratBold",
            },
            
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="star" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map View",
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].backgroundLight,
              boxShadow: "0px 0px 0px #000",
            },
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerBackTitleStyle: {
              fontSize: 14,
              fontFamily: "MontserratBold",
            },
            headerTitleStyle: {
              textAlign: "center",
              fontFamily: "MontserratBold",
            },
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="map" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].backgroundLight,
              boxShadow: "0px 0px 0px #000",
            },
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerBackTitleStyle: {
              fontSize: 14,
              fontFamily: "MontserratBold",
            },
            headerTitleStyle: {
              textAlign: "center",
              fontFamily: "MontserratBold",
            },
            tabBarIcon: ({ color }) => (
              <Feather size={28} name="settings" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
