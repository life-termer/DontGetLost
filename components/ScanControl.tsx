import {
  Text,
  type TextProps,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import useBLE from "@/hooks/useBLE";

export type ScanControlProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ScanControl({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ScanControlProps) {
  const { isScanning, setIsScanning } = useContext(GlobalContext);

  const {
    // allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    clearAll,
  } = useBLE();
  const colorPlay = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorStop = useThemeColor(
    { light: lightColor, dark: darkColor },
    "red"
  );

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const connect = async (device: any) => {
    connectToDevice(device);
  };

  const handleStartScan = () => {
    if (scanForDevices) {
      console.log("Starting scan for devices...");
      scanForDevices();
    }
  };
  const handleStopScan = () => {
    if (stopScanForPeripherals) {
      console.log("Scan for devices stopped");
      stopScanForPeripherals();
    }
  };

  return (
    <ThemedView style={styles.controlsWrapper}>
      {isScanning ? (
        <>
          <ThemedText style={{ fontSize: 14 }}>Scanning ...</ThemedText>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#dddddd0"
            onPress={handleStopScan}
          >
            <FontAwesome6 size={28} name="circle-stop" color={colorStop} />
          </TouchableHighlight>
        </>
      ) : (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#dddddd0"
          onPress={handleStartScan}
        >
          <FontAwesome6 size={28} name="circle-play" color={colorPlay} />
        </TouchableHighlight>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  controlsWrapper: {
    backgroundColor: "#fff ",
    display: "flex",
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
