import { StyleSheet, type TextProps, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  onSave: () => void
};

export default function SaveModalBtn({
  lightColor,
  darkColor,
  onSave,
}: Props) {
  const { isScanning } =
      useContext(GlobalContext);

  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorBackgroundLight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  return (
    <TouchableOpacity onPress={onSave}
      style={[
        { backgroundColor: colorIcon, borderColor: colorBackgroundLight },
        styles.button,
      ]}
    >
      <ThemedText style={[{color: colorBackgroundLight},styles.text]}>Save Changes</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    paddingVertical: 10,
    
  },
  text: {
    textAlign: "center",
    margin: "auto",
    fontFamily: 'MontserratSemiBold',
    fontSize: 15,
  }
});
