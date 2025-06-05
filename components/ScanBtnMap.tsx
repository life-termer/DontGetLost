import {
  type TextProps,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import Feather from "@expo/vector-icons/Feather";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import useBLE from "@/hooks/useBLE";
import { Entypo } from "@expo/vector-icons";

export type ScanControlProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  tab?: string;
};

export function ScanBtnMap({
  style,
  lightColor,
  darkColor,
  tab,
  ...otherProps
}: ScanControlProps) {
  const { isScanning, setIsScanning, setInitialState } =
    useContext(GlobalContext);

  const {
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    bluetoothState,
  } = useBLE();
  const colorPlay = useThemeColor(
    { light: lightColor, dark: darkColor },
    "greenAlpha"
  );
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorStop = useThemeColor(
    { light: lightColor, dark: darkColor },
    "redAlpha"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  //TODO: try useCallback to avoid creating new function on every render
  const handleStartScan = () => {
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

  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );
  const styles = StyleSheet.create({
    controlsWrapper: {
      backgroundColor: "transparent",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      justifyContent: "flex-end",
      pointerEvents: "auto",
      alignItems: "flex-end",
      position: "absolute",
      top: isScanning ? 20 : "50%",
      left: isScanning ? 10 : "50%",
      transform: isScanning
        ? [{ translateX: 0 }, { translateY: 0 }]
        : [{ translateX: '-50%'}, { translateY: '-65%'}],
      zIndex: 100000,
    },
    button: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      width: 50,
      gap: 5,
      height: 50,
    },
    buttonXL: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 8,
      // filter: "blur(100px)",
      paddingHorizontal: 10,
      width: windowDimensions.width / 1.6,
      gap: 5,
      height: windowDimensions.height / 1.8,
    },
    text: {
      fontSize: 14,
      fontFamily: "defaultSemiBold",
    },
  });
  useEffect(() => {
    const onChange = ({ window }: { window: any }) =>
      setWindowDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  }, []);

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
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleStopScan}
            style={[
              { backgroundColor: colorStop, borderColor: colorRed },
              styles.button,
            ]}
          >
            <Ionicons name="stop-outline" size={24} color={colorRed} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleStartScan}
          style={[
            { backgroundColor: colorPlay, borderColor: colorGreen },
            styles.buttonXL,
          ]}
        >
          <Entypo name="controller-play"  size={90} color={colorGreen} />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
