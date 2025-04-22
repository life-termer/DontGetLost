import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";

export type ScanControlProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function DevicesListAll({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ScanControlProps) {

  const colorPlay = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorStop = useThemeColor(
    { light: lightColor, dark: darkColor },
    "red"
  );



  return (
    <ThemedView style={styles.listWrapper}>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
});
