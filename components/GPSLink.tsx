import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
  View,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from '@expo/vector-icons/Feather';

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  deviceName?: string;
};

export function GPSLink({
  style,
  lightColor,
  darkColor,
  deviceName,
  ...otherProps
}: Props) {
  const openMap = () => {
    const latitude = 46.056946; // Replace with your desired latitude
    const longitude = 14.505751; // Replace with your desired longitude
    const label = deviceName || "Device Location";
    const url = Platform.select({
      ios: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      // android: `geo:${latitude},${longitude}?q=${label}`,
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    url && Linking.openURL(url);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <View
      style={[
        {
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 30,
        },
        styles.rowContainer,
      ]}
    >
      <TouchableOpacity onPress={openMap} style={[{ backgroundColor: colorBackground }, styles.dataContainer]}>
     
        <Entypo name="location" size={24} color={colorBlue} />
        <View>
          <ThemedText
            type="subtitle"
            style={[{ marginBottom: 5 }, styles.baseText]}
          >
            Location
          </ThemedText>
         
        </View>
      </TouchableOpacity>
      <View
        style={[{ backgroundColor: colorBackground }, styles.dataContainer]}
      >
        <Feather name="clock" size={20} color={colorRed}/>
        <View>
          <ThemedText
            type="subtitle"
            style={[{ marginBottom: 5 }, styles.baseText]}
          >
            Last Seen
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.textSm}>
            {formatDate(Date.now())}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    flexBasis: "48%",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    height: 60
  },
  text: {
    fontSize: 14,
  },
  textSm: {
    fontSize: 12,
    lineHeight: 15,
  },
  baseText: {
    fontSize: 13,
    lineHeight: 16,
  },
});
