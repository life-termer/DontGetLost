import { useContext, useEffect, type PropsWithChildren, type ReactElement } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import DeviceCard from "./DeviceCard";
import ModalInfo from "./ModalInfo";
import { ScanningState } from "./ScanningState";

export default function AllDevicesList() {
  const { allDevices, sorting, currentDevice, search } = useContext(GlobalContext);
  //   console.log("AllDevicesList", allDevices);
  const device = allDevices.find((device: any) => device.id === currentDevice);
  const filteredDevices = allDevices
  .filter((device: any) => {
    if (!search) return true;
    return device.name.toLowerCase().includes(search.toLowerCase());
  })
  .sort((a: any, b: any) => {
    if (sorting === "asc") return a.name.localeCompare(b.name);
    else if (sorting === "dsc") return b.name.localeCompare(a.name);
    else {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance; // Sort by distance
      } else if (a.distance === undefined) {
        return 1; // Place devices without distance at the end
      } else if (b.distance === undefined) {
        return -1; // Place devices without distance at the end
      }
    }
  });
  return (
    <>
      {allDevices.length > 0 ? (
        <ThemedView style={styles.listContainer}>
          <ThemedView style={styles.listWrapper}>
            {filteredDevices.map((device: any) => {
              return  (
                <DeviceCard device={device} key={device.id} />
              ) 
            })}
          </ThemedView>
          {device && <ModalInfo device={device} />}
        </ThemedView>
      ) : <View />}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    minHeight: "100%",
    padding: 16,
    paddingBottom: 150,
  },
  listWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    paddingLeft: 10,
    textTransform: "uppercase",
    fontSize: 15,
    opacity: 0.6,
  },
});
