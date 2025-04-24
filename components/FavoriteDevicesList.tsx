import {
  useContext,
  useEffect,
} from "react";
import { StyleSheet} from "react-native";


import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import DeviceCardFavorites from "./DeviceCardFavorites";
import DeviceCard from "./DeviceCard";


export default function FavoriteDevicesList({tab}:{tab:string | undefined}) {
  const { allDevices, favoriteDevices, setFavoriteDevices } =
    useContext(GlobalContext);
  // Automatically update favoriteDevices when allDevices changes
  useEffect(() => {
    const favorites = allDevices.filter((device:any) => device.isFavorite);
    if (
      JSON.stringify(favorites) !== JSON.stringify(favoriteDevices)
    ) {
      setFavoriteDevices(favorites);
    }
  }, [allDevices, setFavoriteDevices]);
  return (
    <>
      {favoriteDevices.length > 0 && (
        <ThemedView style={[{paddingBottom: tab === "favorites" ? 32: 0}, styles.listContainer]}>
          <ThemedText type="title" style={styles.title}>
            Favorite Devices
          </ThemedText>
          <ThemedView style={styles.listWrapper}>
            {favoriteDevices.map((device: any) => {
              return tab === "favorites" ? <DeviceCardFavorites device={device} key={device.id} /> : <DeviceCard device={device} key={device.id} />;
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
