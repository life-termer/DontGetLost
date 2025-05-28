import React, {
} from "react";
import {
  StyleSheet,
  type TextProps,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
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
