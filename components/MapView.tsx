import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  Dimensions,
  TextProps,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GlobalContext } from "@/context/GlobalContext";
import DeviceCardMap from "./DeviceCardMap";
import OfflineDevicesMap from "./OfflineDevicesMap";
import LegendMap from "./LegendMap";

const DEVICE_SIZE = 75; // Size of the device circles
const MY_DEVICE_SIZE = 50; // Size of the "My Device" circle
const MAX_DISTANCE = 50; // Maximum distance to display devices

export type MapViewProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function MapView({ lightColor, darkColor }: MapViewProps) {
  const colorScheme = useColorScheme();
  const { initialState, allDevices, isScanning } =
    useContext(GlobalContext);

  const [dimensions, setDimensions] = useState(() => Dimensions.get("window"));
  const heightDevice = dimensions.height - 140;
  const activeDevices = allDevices.filter(
    (device: any) => device.distance !== undefined && device.isFavorite
  );

  const favoriteDevices = allDevices.filter(
    (device: any) => device.isFavorite
  );
  const offlineDevices = allDevices.filter(
    (device: any) => device.isOutOfRange && device.isFavorite
  );
  const inProximityDevices = allDevices.filter(
    (device: any) => device.distance <= 50 && device.isFavorite
  );

  const nearbyDevices = () => {
    
    // const inProximityDevices = devices.filter(
    //   (device: any) => device.distance < 50
    // );
    console.log(
      favoriteDevices.length,
      "all",
      inProximityDevices.length,
      "in proximity",
      offlineDevices.length,
      "offline",
    );
    if (initialState) return Colors[colorScheme ?? "light"].background;
    if (!isScanning) return Colors[colorScheme ?? "light"].background;
    if (offlineDevices.length) return Colors[colorScheme ?? "light"].redAlpha2;
    if (favoriteDevices.length === inProximityDevices.length)
      return Colors[colorScheme ?? "light"].greenAlpha2;
    else return Colors[colorScheme ?? "light"].background;
  };

  const backgroundColor = nearbyDevices();

  useEffect(() => {
    const handleOrientationChange = () => {
      const newDimensions = Dimensions.get("window");
      setDimensions(newDimensions); // Update dimensions when orientation changes
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => subscription.remove(); // Cleanup listener on unmount
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {favoriteDevices.length ? (
        <View
          style={[
            { backgroundColor: backgroundColor },
            styles.overlay,
          ]}
        ></View>
      ) : (
        <View />
      )}
      <LegendMap />
      {offlineDevices.length && !initialState ? (
        <OfflineDevicesMap offlineDevices={offlineDevices} />
      ) : null}
      <View
        style={{
          width: MY_DEVICE_SIZE,
          height: MY_DEVICE_SIZE,
          borderRadius: MY_DEVICE_SIZE / 2,
          backgroundColor: "#000",
          position: "absolute",
          left: dimensions.width / 2 - MY_DEVICE_SIZE / 2,
          top: heightDevice / 2 - MY_DEVICE_SIZE / 2,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <ThemedText type="subtitle" style={styles.text}>
          Me
        </ThemedText>
      </View>
      {/* Favorite Devices */}
      {activeDevices.map((device: any, index) => {
        // Calculate the position of the device based on its distance
        const distance = Math.min(
          device.distance <= 15 ? 15 : device.distance,
          MAX_DISTANCE - 10
        ); // Limit the distance
        const angle = (index / activeDevices.length) * 2 * Math.PI; // Spread devices around the circle
        const x =
          dimensions.width / 2 +
          distance * (dimensions.width / (2 * MAX_DISTANCE)) * Math.cos(angle) -
          DEVICE_SIZE / 2;
        const y =
          heightDevice / 2 +
          distance * (heightDevice / (2 * MAX_DISTANCE)) * Math.sin(angle) -
          DEVICE_SIZE / 2;

        return (
          <DeviceCardMap
            key={device.id}
            device={device}
            width={dimensions.width}
            heightDevice={heightDevice}
            DEVICE_SIZE={DEVICE_SIZE}
            x={x}
            y={y}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  overlay: {
    position: "absolute",
    top: "-10%",
    left: 0,
    width: "100%",
    height: "120%",
  },
});
