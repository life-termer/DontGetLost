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

export default function FavoritesHeader({ lightColor, darkColor }: SortOptions) {
  const { favoriteDevices } =
    useContext(GlobalContext);

  const colorGreenAlpha2 = useThemeColor(
    { light: lightColor, dark: darkColor },
    "greenAlpha2"
  );
  const colorYellowAlpha2 = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellowAlpha2"
  );
  const colorRedAlpha2 = useThemeColor(
    { light: lightColor, dark: darkColor },
    "redAlpha2"
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

  const nearbyDevices = (devices: any) => {
    const lengthAll = devices.length;
    const nearbyDevices = devices.filter((device: any) => device.distance <= 5);
    const inProximityDevices = devices.filter(
      (device: any) => device.distance <= 50
    );
    if (lengthAll === nearbyDevices.length)
      return 'all';
    else if (inProximityDevices.length)
      return 'some';
    else return 'none';
  };

  const status = nearbyDevices(favoriteDevices);
  return (
    <ThemedView style={styles.listContainer}>
      <ThemedView style={styles.listWrapper}>
        <View
          style={[
            { backgroundColor: status === 'all' ? colorGreenAlpha2 : status === 'some' ? colorYellowAlpha2 : colorRedAlpha2, marginBottom: 1 },
            styles.container,
          ]}
        >
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <FavoritesStats status={status}/>
          </View>
        </View>
        {/* <View style={[{ backgroundColor: colorBackground, marginBottom: 1 }]}>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <SortingButton />
          </View>
        </View> */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContainer: {
    flexDirection: "column",
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
