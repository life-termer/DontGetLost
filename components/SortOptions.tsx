import { useContext, type PropsWithChildren, type ReactElement } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  type TextProps,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Device } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SortingButton } from "./SortingButton";
import { FavoritesStats } from "./FavoritesStats";

export type SortOptions = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function SortOptions({ lightColor, darkColor }: SortOptions) {
  const { allDevices, saveFavoriteDevices2, initialState } =
    useContext(GlobalContext);

  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <ThemedView style={styles.listContainer}>
      <ThemedText type="title" style={styles.title}>
        Sort Options
      </ThemedText>
      <ThemedView style={styles.listWrapper}>
        <View
          style={[
            { backgroundColor: colorBackground, marginBottom: 1 },
            styles.container,
          ]}
        >
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <FavoritesStats />
          </View>
        </View>
        <View style={[{ backgroundColor: colorBackground, marginBottom: 1 }]}>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <SortingButton />
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 30,
  },
  listContainer: {
    padding: 16,
  },
  listWrapper: {
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflow: "hidden",
  },
  title: {
    paddingLeft: 10,
    fontSize: 15,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  baseText: {
    fontSize: 12,
    margin: 0,
    padding: 0,
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
});
