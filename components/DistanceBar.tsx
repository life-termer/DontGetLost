import { StyleSheet, type TextProps, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

export type DistanceBar = TextProps & {
  lightColor?: string;
  darkColor?: string;
  device: {
    distance?: number;
  };
};

export default function DistanceBar({
  lightColor,
  darkColor,
  device,
}: DistanceBar) {
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

  const colorStatus = (distance: number | undefined) => {
    if (distance === undefined || !isScanning) {
      return colorIcon;
    }
    if (distance < 5) {
      return colorGreen;
    } else if (distance < 50) {
      return colorBlue;
    } else {
      return colorYellow;
    }
  };

  const barWidth = 360; // Total width of the distance bar
  const maxDistance = 90; // Maximum distance to consider
  const fillPercentage = Math.max(1 - (device.distance || 0) / maxDistance, 0); // Calculate fill percentage
  const fillWidth = barWidth * fillPercentage;

  return (
    <View
      style={[
        { backgroundColor: colorBackground, borderColor: colorBackground },
        styles.container,
      ]}
    >
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            { width: fillWidth, backgroundColor: colorStatus(device.distance) },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  titleText: {
    fontSize: 11,
    textAlign: "center",
  },
  baseText: {
    fontSize: 13,
    margin: 0,
    padding: 0,
    lineHeight: 15,
    textAlign: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  barContainer: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 8,
  },
});
