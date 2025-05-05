import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Picker } from "@react-native-picker/picker";
import { useContext, useState } from "react";
import { ThemedView } from "./ThemedView";
import { GlobalContext } from "@/context/GlobalContext";

export type FavoritesStats = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function FavoritesStats({
  style,
  lightColor,
  darkColor,
  ...rest
}: FavoritesStats) {
  const { favoriteDevices } = useContext(GlobalContext);
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );

  const activeDevices = favoriteDevices.filter(
    (device: any) => !device.isOutOfRange
  );

  return (
    <View style={styles.container}>
      <ThemedText>Total Favorites: {favoriteDevices.length}</ThemedText>
      <ThemedText style={{ color: colorGreen }}>
        Active Devices: {activeDevices.length}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
  },
  picker: {
    fontFamily: "OpenSans",
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  pickerItems: {
    fontFamily: "OpenSans",
    fontSize: 16,
    lineHeight: 24,
  },
});
