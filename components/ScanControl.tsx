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
  const { isScanning, setIsScanning, setInitialState } =
    useContext(GlobalContext);

  const {
    // allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    clearAll,
    bluetoothState,
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
  //TODO: try useCallback to avoid creating new function on every render
  const handleStartScan = () => {
    console.log(bluetoothState);
    if (scanForDevices) {
      console.log("Starting scan for devices...");
      scanForDevices();
      setIsScanning(true);
      setInitialState(false);
    }
  };
  const handleStopScan = () => {
    if (stopScanForPeripherals) {
      console.log("Scan for devices stopped");
      stopScanForPeripherals();
      setIsScanning(false);
    }
  };

  return (
    <ThemedView
      style={[
        { opacity: bluetoothState === "off" ? 0.4 : 1 },
        styles.controlsWrapper,
      ]}
      pointerEvents={bluetoothState === "off" ? "none" : "auto"}
    >
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
    pointerEvents: "auto",
    alignItems: "flex-end",
  },
});
