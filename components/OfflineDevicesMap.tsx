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
import OfflineDevicesCard from "./OfflineDevicesCard";

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


  const colorOverlayLight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "overlayLight"
  );

  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <View
      style={[
        { backgroundColor: colorOverlayLight, borderColor: colorRed },
        styles.container,
      ]}
    >
      {offlineDevices.map((device: any) => (
        <OfflineDevicesCard key={device.id} device={device} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 10,
    position: "absolute",
    top: 20,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 300,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },

});
