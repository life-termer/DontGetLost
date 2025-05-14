import { useContext} from "react";
import {
  StyleSheet,
  type TextProps,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/context/GlobalContext";
import { useThemeColor } from "@/hooks/useThemeColor";
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
    const offlineDevices = devices.filter((device: any) => device.isOutOfRange);
    const inProximityDevices = devices.filter(
      (device: any) => device.distance < 50
    );
    if (lengthAll === inProximityDevices.length)
      return 'all';
    else if (lengthAll === offlineDevices.length)
      return 'none';
    else return 'some';
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
