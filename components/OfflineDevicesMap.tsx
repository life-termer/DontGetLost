import React, {
  useContext,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  type TextProps,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Device } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export type OfflineDevicesMap = TextProps & {
  lightColor?: string;
  darkColor?: string;
  offlineDevices: any[];
};

export default function OfflineDevicesMap({
  lightColor,
  darkColor,
  offlineDevices,
}: OfflineDevicesMap) {
  const { favoriteDevices } = useContext(GlobalContext);

  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <View
      style={[
        { backgroundColor: colorBackground, borderColor: colorRed },
        styles.container,
      ]}
    >
      {offlineDevices.map((device: any) => (
        <ThemedText
          key={device.id}
          type="subtitle"
          style={[{ color: colorRed }, styles.titleText]}
        >
          {device.customName || device.name}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 11,
    textAlign: "center",
  },
  baseText: {
    fontSize: 13,
    margin: 0,
    padding: 0,
    lineHeight: 15,
    textAlign: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
