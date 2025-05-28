import {
  type TextProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";

export type ScanControlProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ClearBtn({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ScanControlProps) {
  const { setAllDevices, allDevices } =
    useContext(GlobalContext);

 
  const colorBorder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border"
  );


  const handleClear = () => {
    const favorites = allDevices
      .filter((device: any) => device.isFavorite);
      setAllDevices(favorites);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handleClear}
      style={[{ borderColor: colorBorder }, styles.button]}
    >
      <ThemedText style={styles.text}>Clear</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    // width: 100,
    gap: 5,
    height: 40,
  },
  text: {
    fontSize: 14,
    fontFamily: "defaultSemiBold",
  },
});
