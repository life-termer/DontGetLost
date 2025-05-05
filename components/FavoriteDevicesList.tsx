import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import DeviceCardFavorites from "./DeviceCardFavorites";
import DeviceCard from "./DeviceCard";

export default function FavoriteDevicesList({
  tab,
}: {
  tab: string | undefined;
}) {
  const { allDevices, favoriteDevices, setFavoriteDevices, sorting } =
    useContext(GlobalContext);
  // Automatically update favoriteDevices when allDevices changes
  useEffect(() => {
    const favorites = allDevices
      .filter((device: any) => device.isFavorite)
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
    if (JSON.stringify(favorites) !== JSON.stringify(favoriteDevices)) {
      setFavoriteDevices(favorites);
    }
  }, [allDevices, setFavoriteDevices, sorting]);
  return (
    <>
      {favoriteDevices.length > 0 && (
        <ThemedView
          style={[
            {
              paddingBottom: tab === "favorites" ? 32 : 0,
              marginBottom: tab === "favorites" ? 150 : 0,
            },
            styles.listContainer,
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Favorite Devices
          </ThemedText>
          <ThemedView style={styles.listWrapper}>
            {favoriteDevices.map((device: any) => {
              return tab === "favorites" ? (
                <DeviceCardFavorites device={device} key={device.id} />
              ) : (
                <DeviceCard device={device} key={device.id} />
              );
            })}
          </ThemedView>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
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
    fontSize: 15,
    textTransform: "uppercase",
    opacity: 0.6,
  },
});
