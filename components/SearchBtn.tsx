import {
  StyleSheet,
  TextInput,
  type TextProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext, useState } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import Feather from "@expo/vector-icons/Feather";

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  tab?: string;
};

export default function SearchBtn({ lightColor, darkColor ,tab }: Props) {
  const { search, setSearch } = useContext(GlobalContext);
  const [isFocused, setIsFocused] = useState(false);

  const handleNameChange = (text: string) => {
    setSearch(text);
  };

  const colorText = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorBorder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border"
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
    <>
      {isFocused ? (
        <>
          <TextInput
            style={[
              {
                backgroundColor: colorBackgroundLight,
                borderColor: colorBorder,
                color: colorText,
              },
              styles.textInput,
            ]}
            value={search}
            onChangeText={handleNameChange}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />
          <Feather name="search" size={20} color={colorIcon} style={styles.absoluteLeft}/>
          <TouchableOpacity
          onPress={() => setSearch("")}
          style={[styles.absoluteRight]}
        >

          <Feather name="x" size={20} color={colorIcon}/>
        </TouchableOpacity>
        </>
      ) : (null
      )}
        <TouchableOpacity
          onPress={() => setIsFocused(true)}
          style={[{pointerEvents: tab === "map" ? "none" : "auto"},styles.container]}
        >
          <View
            style={[
              {
                backgroundColor: colorBackgroundLight,
                borderColor: colorBorder,
              },
              styles.button,
            ]}
          >
            <Feather name="search" size={20} color={colorIcon} />
          </View>
        </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    // width: "100%",
    padding: 10,
    height: 40,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    position: "absolute",
    height: 40,
    paddingHorizontal: 40,
    width: "100%",
    top: 0,
    left: 15,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 16,
    zIndex: 100,
  },
  absoluteLeft: {
    position: "absolute",
    left: 25,
    top: 10,
    zIndex: 200
  },
  absoluteRight: {
    position: "absolute",
    right: 25,
    top: 10,
    zIndex: 200
  }
});
