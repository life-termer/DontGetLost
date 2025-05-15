import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
  View,
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

export function ScanningState({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ScanControlProps) {
  const { bluetoothState } = useBLE();
  const { isScanning } = useContext(GlobalContext);

  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "greenAlpha"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <View style={[{ backgroundColor: colorBackground }, styles.container]}>
      {bluetoothState === "off" ? (
        <>
          <FontAwesome size={16} name="circle" color={colorRed} />
          <ThemedText style={styles.text}>Bluetooth is off</ThemedText>
        </>
      ) : (
        <>
          <FontAwesome size={16} name="circle" color={colorGreen} />
          <ThemedText style={styles.text}>Scanning for devices...</ThemedText>
        </>
      )}
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 14,
  },
});
