import React, {
  useContext,
  useState,
} from "react";
import {
  StyleSheet,
  type TextProps,
  TouchableOpacity,
} from "react-native";

import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import ModalInfo from "./ModalInfo";

export type OfflineDevicesMap = TextProps & {
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

export default function OfflineDevicesCard({
  lightColor,
  darkColor,
  device,
}: OfflineDevicesMap) {
  const { setCurrentDevice } = useContext(GlobalContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setCurrentDevice(device.id);
    setIsModalVisible(true);
  };

  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  return (
    <>
      <TouchableOpacity onPress={showModal}>
        <ThemedText
          key={device.id}
          type="subtitle"
          style={[{ color: colorRed }, styles.titleText]}
        >
          {device.customName || device.name}
        </ThemedText>
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
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 12,
    lineHeight: 20,
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
