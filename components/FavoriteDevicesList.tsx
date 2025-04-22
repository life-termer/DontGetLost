import {
  useContext,
  useEffect,
  type PropsWithChildren,
  type ReactElement,
} from "react";
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

export default function FavoriteDevicesList() {
  const { allDevices, favoriteDevices, setFavoriteDevices } =
    useContext(GlobalContext);

  // Automatically update favoriteDevices when allDevices changes
  useEffect(() => {
    const favorites = allDevices.filter((device) => device.isFavorite);
    setFavoriteDevices(favorites);
  }, [allDevices]);
  return (
    <>
      {favoriteDevices.length > 0 && (
        <ThemedView style={styles.listContainer}>
          <ThemedText type="title" style={styles.title}>
            Favorites
          </ThemedText>
          <ThemedView style={styles.listWrapper}>
            {favoriteDevices.map((device: any) => {
              return <DeviceCard device={device} key={device.id} />;
            })}
          </ThemedView>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    // minHeight: "80%",
    padding: 16,
  },
  listWrapper: {
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflow: "hidden",
  },
  title: {
    paddingLeft: 10,
    fontSize: 16,
    opacity: 0.7,
  },
});
