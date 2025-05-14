import {
  StyleSheet,
  Image,
  Platform,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import MapView from "@/components/MapView";
import SubHeader from "@/components/SubHeader";
import { ScanBtnMap } from "@/components/ScanBtnMap";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <ScanBtnMap />
      {/* <SubHeader tab='map' /> */}
      <MapView />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
