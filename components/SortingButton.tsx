import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { GlobalContext } from "@/context/GlobalContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AntDesign } from "@expo/vector-icons";

const data = [
  { label: "Name (A to Z)", value: "asc" },
  { label: "Name (Z to A)", value: "dsc" },
  { label: "Distance", value: "distance" },
];

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "primary" | "secondary";
};

export default function SortingButton({
  style,
  lightColor,
  darkColor,
  type = "primary",
  ...rest
}: Props) {
  const [isFocus, setIsFocus] = useState(false);
  const { sorting, setSorting } = useContext(GlobalContext);
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorText = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const colorBorder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );
  const styles = StyleSheet.create({
    container: {},
    itemContainer: {
      width: 200,
      borderColor: colorBorder,
      backgroundColor: colorBackground,
      borderWidth: 1,
      borderRadius: 8,
      overflow: "hidden",
    },
    itemContainerStyle: {
      backgroundColor: colorBackground,
    },
    itemTextStyle: {
      color: colorText,
      margin: 0,
    },
    dropdown: {
      height: 40,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      fontSize: 14,
    },
    icon: {
      marginRight: 0,
    },
    label: {
      position: "absolute",
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
    },
    placeholderStyle: {
      display: "none",
    },
    selectedTextStyle: {
      fontSize: 15,
      display: "none",
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 15,
      display: "none",
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colorBackground,
    },
    textItem: {
      flex: 1,
      fontSize: 15,
      color: colorText,
    },
  });
  interface Item {
    label: string;
    value: string;
  }

  const renderItem = (item: Item): JSX.Element => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === sorting && (
          <AntDesign
            style={styles.icon}
            color={colorIcon}
            name="checkcircleo"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {renderLabel()} */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: colorIcon }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.itemContainer}
        itemContainerStyle={styles.itemContainerStyle}
        itemTextStyle={styles.itemTextStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={""}
        value={sorting}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSorting(item.value);
          setIsFocus(false);
        }}
        renderRightIcon={() => (
          <FontAwesome5
            name="sort-amount-up"
            size={20}
            color={isFocus ? colorText : colorIcon}
            style={styles.icon}
          />
        )}
        renderItem={renderItem}
      />
    </View>
  );
}
