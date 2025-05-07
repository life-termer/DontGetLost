import { StyleSheet, type TextProps, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";

export type LegendMap = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function LegendMap({ lightColor, darkColor }: LegendMap) {
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
    <View
      style={[
        { backgroundColor: colorBackgroundLight, borderColor: colorBackground },
        styles.container,
      ]}
    >
      <View style={{display: 'flex', gap: 3, flexDirection: "row", alignItems: "center"}}>
        <FontAwesome
          size={12}
          name="circle"
          color={colorGreen}
        />
        <ThemedText type="subtitle" style={styles.titleText}>
          Nearby
        </ThemedText>
      </View>
      <View style={{display: 'flex', gap: 3, flexDirection: "row", alignItems: "center"}}>
        <FontAwesome
          size={12}
          name="circle"
          color={colorBlue}
        />
        <ThemedText type="subtitle" style={styles.titleText}>
          {"<50m"}
        </ThemedText>
      </View>
      <View style={{display: 'flex', gap: 3, flexDirection: "row", alignItems: "center"}}>
        <FontAwesome
          size={12}
          name="circle"
          color={colorYellow}
        />
        <ThemedText type="subtitle" style={styles.titleText}>
          {">50m"}
        </ThemedText>
      </View>
      <View style={{display: 'flex', gap: 3, flexDirection: "row", alignItems: "center"}}>
        <FontAwesome
          size={12}
          name="circle"
          color={colorRed}
        />
        <ThemedText type="subtitle" style={styles.titleText}>
          Offline
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    position: "absolute",
    bottom: 155,
    left: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
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
});
