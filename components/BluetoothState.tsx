import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import useBLE from "@/hooks/useBLE";

export type ScanControlProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function BluetoothState({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ScanControlProps) {
  const { bluetoothState } = useBLE();

  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <ThemedView style={[{backgroundColor: colorBackground},styles.badge]}>
      <ThemedText
        style={
          bluetoothState === "on"
            ? [{ color: colorBlue }, styles.text]
            : [{ color: colorRed }, styles.text]
        }
      >{`Bluetooth is ${bluetoothState}`}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
  textRed: {
    fontSize: 14,
    color: "red",
  },
});
