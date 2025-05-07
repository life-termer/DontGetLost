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
import DistanceBar from "./DistanceBar";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
    customName: string;
  };
};

export default function DeviceCard({
  lightColor,
  darkColor,
  device,
}: DeviceCardProps) {
  const { allDevices, saveFavoriteDevices2, initialState, isScanning } =
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
    "background"
  );
  const colorBackgroundLight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );
  const colorBorder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border"
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
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const { setAllDevices } = useContext(GlobalContext);

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

  return (
    <View
      style={[
        { backgroundColor: colorBackgroundLight, borderColor: colorBorder },
        styles.container,
      ]}
    >
      <View style={[{ marginBottom: 5 }, styles.rowContainer]}>
        <View style={[{ gap: 5 }, styles.rowContainer]}>
          <Feather
            name="bluetooth"
            size={16}
            color={colorStatus(device.distance)}
          />
          <ThemedText
            type="subtitle"
            style={{ fontSize: 15, lineHeight: 16, marginEnd: 5 }}
          >
            {device.customName || device.name}
          </ThemedText>
          <Octicons name="pencil" size={15} color="black" />
        </View>
        <View style={[{ gap: 20 }, styles.rowContainer]}>
          <TouchableOpacity>
            <FontAwesome size={20} name="info" color={colorIcon} />
          </TouchableOpacity>
          {device.isFavorite ? (
            <TouchableOpacity
              onPress={() => toggleFavorite(device.id)}
              style={{ width: 22, height: 22 }}
            >
              <FontAwesome size={22} name="star" color={colorYellow} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => toggleFavorite(device.id)}
              style={{ width: 22, height: 22 }}
            >
              <FontAwesome6 size={20} name="star" color={colorIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View>
          <ThemedText style={[{ marginBottom: 10 }, styles.baseText]}>
            {device.id}
          </ThemedText>
          {/* {initialState || (
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
          )} */}
          <View style={[{justifyContent: "space-between", width: "100%"},styles.rowContainer]}>
            <View
              style={[
                { backgroundColor: colorBackground },
                styles.dataContainer,
              ]}
            >
              <ThemedText style={[{ marginBottom: 4 }, styles.baseText]}>
                <FontAwesome6 size={12} name="tower-broadcast" /> RSSI
              </ThemedText>
              <ThemedText style={[styles.baseText]}>
                {device.rssi} dBm
              </ThemedText>
            </View>
            <View
              style={[
                { backgroundColor: colorBackground },
                styles.dataContainer,
              ]}
            >
              <ThemedText style={[{ marginBottom: 4 }, styles.baseText]}>
              <MaterialCommunityIcons name="map-marker-distance" size={14} /> Distance
              </ThemedText>
              <ThemedText style={[styles.baseText]}>
              ~{device.distance?.toFixed(2)}m
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <DistanceBar device={device} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  dataContainer: {
    textAlign: "center",
    display: "flex",
    flexBasis: "48%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 30,
  },

  baseText: {
    fontSize: 13,
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
});
