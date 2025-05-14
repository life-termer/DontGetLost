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
import AntDesign from '@expo/vector-icons/AntDesign';

export type FavoritesStats = TextProps & {
  lightColor?: string;
  darkColor?: string;
  status: string
};

export function FavoritesStats({
  style,
  lightColor,
  darkColor,
  status,
  ...rest
}: FavoritesStats) {
  const { favoriteDevices } = useContext(GlobalContext);
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorRed = useThemeColor(
    { light: lightColor, dark: darkColor },
    "red"
  );

  const activeDevices = favoriteDevices.filter(
    (device: any) => device.distance < 50
  );


  return (
    <View style={styles.columnContainer}>
    <View style={styles.rowContainer}>
      <ThemedText type="defaultSemiBold" style={styles.text}>Favorites: {favoriteDevices.length}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.text}>|</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.text}>
        In proximity: {activeDevices.length}
      </ThemedText>
    </View>
      <View style={styles.rowContainer}>
        <AntDesign name="warning" size={18} color={status === 'all' ? colorGreen : status === 'some' ? colorYellow : colorRed} />
        <ThemedText style={styles.textSm}>{status === 'all' ? "All devices nearby" : status === 'some' ? "Some devices nearby" : "No devices nearby"}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  columnContainer: {
    flexDirection: "column",
    gap: 8,    
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
  },
  textSm: {
    fontSize: 13,
    lineHeight: 15,
  },
});
