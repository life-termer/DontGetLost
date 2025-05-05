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

  const colorStatus = (distance: number | undefined) => {
    if (distance === undefined) {
      return colorIcon;
    }
    if (distance < 1) {
      return colorGreen;
    } else if (distance < 4) {
      return colorYellow;
    } else {
      return colorBlue;
    }
  };
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const { setAllDevices } = useContext(GlobalContext);

  const saveFavoriteDevices = async () => {
    console.log("Starting saving favorite devices to storage");
    try {
      await AsyncStorage.setItem("favoriteDevices", JSON.stringify(allDevices));
    } catch (error) {
      console.log("Failed to save favorite devices to storage", error);
    }
  };
  const toggleFavorite = (deviceId: string) => {
    setAllDevices((prevState: any[]) => {
      const updatedDevices = prevState.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              isFavorite: !device.isFavorite,
              favoriteTimestamp: !device.isFavorite ? Date.now() : null,
            }
          : device
      );
      // Save the updated devices after toggling the favorite status
      saveFavoriteDevices2(updatedDevices);
      return updatedDevices;
    });
  };
  const toggleFavorite2 = (deviceId: string) => {
    setAllDevices((prevDevices: any[]) => {
      return prevDevices.map((device) => {
        if (device.id === deviceId) {
          const updatedDevice = {
            ...device,
            isFavorite: !device.isFavorite,
            favoriteTimestamp: !device.isFavorite ? Date.now() : null, // Add or remove timestamp
          };
          return updatedDevice;
        }
        return device;
      });
    });
    console.log("Saved favorite devices to storage", allDevices);
    saveFavoriteDevices();
  };

  return (
    <View style={[{ backgroundColor: colorBackground }, styles.container]}>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <ThemedText type="subtitle" style={{ fontSize: 14, lineHeight: 16 }}>
          {device.name}
        </ThemedText>
        <View style={styles.rowContainer}>
          <View style={styles.baseText}>
            <ThemedText style={styles.baseText}>{device.id}</ThemedText>
            {initialState || (
              <View>
                {device.isOutOfRange ? (
                  <ThemedText style={[{ color: colorRed }, styles.baseText]}>
                    Out of range
                  </ThemedText>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <ThemedText
                      style={[
                        { color: colorStatus(device.distance) },
                        styles.baseText,
                      ]}
                    >
                      <FontAwesome6 size={10} name="tower-broadcast" />{" "}
                      {device.rssi} dBm
                    </ThemedText>
                    <FontAwesome
                      size={6}
                      name="circle"
                      color={colorStatus(device.distance)}
                    />
                    <ThemedText
                      style={[
                        { color: colorStatus(device.distance) },
                        styles.baseText,
                      ]}
                    >
                      {device.distance !== undefined ? (
                        <>
                          <FontAwesome6 size={10} name="ruler-horizontal" />{" "}
                          {device.distance.toFixed(2)} m
                        </>
                      ) : (
                        "Distance Unknown"
                      )}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>
          {device.isFavorite ? (
            <TouchableOpacity>
              <FontAwesome size={20} name="star" color={colorYellow} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => toggleFavorite(device.id)}>
              <FontAwesome6 size={20} name="star" color={colorIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
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
