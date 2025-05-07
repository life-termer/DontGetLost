import { useContext, type PropsWithChildren, type ReactElement } from "react";
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

export default function AllDevicesList() {
  const { allDevices, favoriteDevices } = useContext(GlobalContext);
  //   console.log("AllDevicesList", allDevices);
  return (
    <>
      {allDevices.length > 0 && allDevices.length != favoriteDevices.length && (
        <ThemedView style={styles.listContainer}>
          {/* <ThemedText type="title" style={styles.title}>
            All Devices
          </ThemedText> */}
          <ThemedView style={styles.listWrapper}>
            {/* {allDevices.map((device: any) => {
              return device.isFavorite === false ? (
                <DeviceCard device={device} key={device.id} />
              ) : null;
            })} */}
            {allDevices.map((device: any) => {
              return  (
                <DeviceCard device={device} key={device.id} />
              ) 
            })}
          </ThemedView>
        </ThemedView>
      )}
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
