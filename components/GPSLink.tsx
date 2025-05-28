import {
  type TextProps,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from '@expo/vector-icons/Feather';

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  device: any;
};

export function GPSLink({
  style,
  lightColor,
  darkColor,
  device,
  ...otherProps
}: Props) {
  const copyToClipboard = async (string: string) => {
    // await Clipboard.setStringAsync(string);
  };
  const openMap = () => {
    const latitude = device.location.latitude ? device.location.latitude : ""; // Replace with your desired latitude
    const longitude = device.location.longitude ? device.location.longitude : ""; // Replace with your desired longitude
    const locationString = `${latitude}, ${longitude}`;

    // copyToClipboard(locationString);
    // Alert.alert(
    //   "Location copied to clipboard",
    //   `Latitude: ${latitude}, Longitude: ${longitude}`,
    //   [{ text: "OK" }]
    // );

  const url = `geo:${latitude},${longitude}?q=${latitude}, ${longitude}(${device.name})`;
  
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Maps application not available.');
      } else {
        
        console.log('Opening URL:', url);
        return Linking.openURL(url);
      }
    })
    .catch(err => console.error('An error occurred', err));
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
      <TouchableOpacity onPress={openMap} style={[{ backgroundColor: colorBackground, pointerEvents: device.location.latitude ? "auto" : "none", opacity: device.location.latitude ? 1 : 0.5 }, styles.dataContainer]}>
     
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
            {formatDate(device.lastSeen)}
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
    width: "48%",
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
