import { useContext, type PropsWithChildren, type ReactElement } from "react";
import {
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

type Props = PropsWithChildren<{}>;

export type DeviceCardProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  device: {
    id: string;
    name: string;
    isConnectable: boolean;
    mtu: number;
    rssi: number;
    distance?: number;
    isFavorite: boolean;
    isOutOfRange: boolean;
  };
};

export default function DeviceCard({
  lightColor,
  darkColor,
  device,
}: DeviceCardProps) {
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorGray = useThemeColor(
    { light: lightColor, dark: darkColor },
    "gray"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const { setAllDevices } = useContext(GlobalContext);
  const toggleFavorite = (deviceId: string) => {
    setAllDevices((prevState: any[]) =>
      prevState.map((device) =>
        device.id === deviceId
          ? { ...device, isFavorite: !device.isFavorite }
          : device
      )
    );
  };

  return (
    <View style={[{ borderBottomColor: colorGray }, styles.container]}>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <ThemedText type="subtitle" style={{ fontSize: 14, lineHeight: 16 }}>
          {device.name}
        </ThemedText>
        <View style={styles.rowContainer}>
          <View>
            <ThemedText style={styles.baseText}>{device.id}</ThemedText>
            {device.isOutOfRange ? (
              <ThemedText style={[{ color: colorRed }, styles.baseText]}>
                Out of range
              </ThemedText>
            ) : (
              <View style={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <ThemedText style={styles.baseText}>
                  RSSI: {device.rssi}
                </ThemedText>

                <ThemedText style={styles.baseText}>
                  {device.distance !== undefined
                    ? "Distance :" + device.distance.toFixed(2) + " m"
                    : "Distance Unknown"}
                </ThemedText>
              </View>
            )}
          </View>
          {device.isFavorite ? (
            <FontAwesome
              size={20}
              name="star"
              color={colorYellow}
              onPress={() => toggleFavorite(device.id)}
            />
          ) : (
            <FontAwesome6
              size={20}
              name="star"
              color={colorGray}
              onPress={() => toggleFavorite(device.id)}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
