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

export type SortingButton = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "primary" | "secondary";
};

export function SortingButton({
  style,
  lightColor,
  darkColor,
  type = "primary",
  ...rest
}: SortingButton) {
  const { sorting, setSorting } = useContext(GlobalContext);
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  return (
    <View style={styles.rowContainer}>
      <ThemedText style={{ width: "50%", fontSize: 15 }}>Sort By</ThemedText>

      <Picker
        selectedValue={sorting}
        style={[{ color: text }, styles.picker]}
        onValueChange={(itemValue, itemIndex) => setSorting(itemValue)}
        selectionColor={text}
        dropdownIconColor={text}
      >
        <Picker.Item
          label="Name (A to Z)"
          value="asc"
          style={{
            color: text,
            backgroundColor: colorBackground,
            fontSize: 15,
          }}
        />
        <Picker.Item
          label="Name (Z to A)"
          value="dsc"
          style={{
            color: text,
            backgroundColor: colorBackground,
          }}
        />
        <Picker.Item
          label="Distance"
          value="distance"
          style={{
            color: text,
            backgroundColor: colorBackground,
          }}
        />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  picker: {
    fontFamily: "OpenSans",
    flex: 1,
  },
  pickerItems: {
    fontFamily: "OpenSans",
    fontSize: 14,
    lineHeight: 24,
  },
});
