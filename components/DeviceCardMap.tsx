import React, {
  useContext,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
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
import { Colors } from "@/constants/Colors";
import ModalInfo from "./ModalInfo";

export type DeviceCardProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  width: number;
  heightDevice: number;
  DEVICE_SIZE: number;
  x: number;
  y: number;
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

export default function DeviceCardMap({
  lightColor,
  darkColor,
  width,
  heightDevice,
  device,
  DEVICE_SIZE,
  x,
  y,
}: DeviceCardProps) {
  const { setCurrentDevice } = useContext(GlobalContext);
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorGreenAlpha = useThemeColor(
    { light: lightColor, dark: darkColor },
    "greenAlpha"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorYellowAlpha = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellowAlpha"
  );
  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorBlueAlpha = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blueAlpha"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );
  const showModal = () => {
    setCurrentDevice(device.id);
    setIsModalVisible(true);
  };
  const colorStatus = (distance: number | undefined) => {
    if (distance === undefined) {
      return colorIcon;
    }
    if (distance < 50) {
      return colorGreen;
    } else {
      return colorYellow;
    }
  };
  const bgColorStatus = (distance: number | undefined) => {
    if (distance === undefined) {
      return colorIcon;
    }
    if (distance < 50) {
      return colorGreenAlpha;
    } else {
      return colorYellowAlpha;
    }
  };
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const lineX = width / 2;
  const lineY = heightDevice / 2;
  const lineWidth =
    Math.sqrt(
      (x + DEVICE_SIZE / 2 - lineX) ** 2 + (y + DEVICE_SIZE / 2 - lineY) ** 2
    ) -
    DEVICE_SIZE / 2 -
    5;
  const distanceTextX = lineX + (x + DEVICE_SIZE / 2 - lineX) / 2;
  const distanceTextY = lineY + (y + DEVICE_SIZE / 2 - lineY) / 2;
  return (
    <>
      <View
        style={{
          position: "absolute",
          left: lineX,
          top: lineY,
          width: lineWidth,
          height: 2,
          backgroundColor: bgColorStatus(device.distance),
          transformOrigin: "left top",
          zIndex: 10,
          transform: [
            {
              rotate: `${
                Math.atan2(
                  y + DEVICE_SIZE / 2 - lineY,
                  x + DEVICE_SIZE / 2 - lineX
                ) *
                (180 / Math.PI)
              }deg`,
            },
          ],
        }}
      />
      <View
        style={{
          position: "absolute",
          left: distanceTextX,
          top: distanceTextY,
          transform: [
            {
              translateX: "-50%",
            },
            {
              translateY: "-50%",
            },
          ],
          backgroundColor: colorBackground,
          transformOrigin: "left top",
          zIndex: 200,
          borderRadius: 4,
          boxShadow: `0px 1px 1px 1px ${bgColorStatus(device.distance)}`,
        }}
      >
        <ThemedText style={styles.baseText}>
          {device.distance?.toFixed(0)}m
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={showModal}
        key={device.id}
        style={[
          {
            width: DEVICE_SIZE,
            height: DEVICE_SIZE,
            borderRadius: DEVICE_SIZE / 2,
            backgroundColor: bgColorStatus(device.distance),
            borderColor: colorStatus(device.distance),
            left: x,
            top: y,
          },
          styles.container,
        ]}
      >
        <ThemedText type="subtitle" style={styles.titleText}>
          {device.customName || device.name}
        </ThemedText>
        {/* <ThemedText style={styles.baseText}>
        {device.distance?.toFixed(2)}m
      </ThemedText> */}
      </TouchableOpacity>
      {isModalVisible ? (
        <ModalInfo
          device={device}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    padding: 3,
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
