import { useCallback, useContext, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { GlobalContext } from "@/context/GlobalContext";
import DeviceCard from "./DeviceCard";
import FavoritesHeader from "./FavoritesHeader";

export default function FavoriteDevicesList({
  tab,
}: {
  tab: string | undefined;
}) {
  const { allDevices, favoriteDevices, setFavoriteDevices, sorting, search } =
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
  }, [allDevices, setFavoriteDevices, sorting, search]);
  const filteredFavorites = favoriteDevices.filter((device: any) => {
    if (!search) return true;
    return device.name.toLowerCase().includes(search.toLowerCase());
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => <DeviceCard device={item} />,
    []
  );

  const ListHeader = useCallback(() => {
    return <FavoritesHeader />; // Render your FavoritesHeader component here
  }, []);

  const keyExtractor = useCallback((item: any) => item.id, []);
  return (
    <>
      {favoriteDevices.length > 0 ? (
          <FlatList
            data={filteredFavorites}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            removeClippedSubviews={false}
            ListHeaderComponent={ListHeader}
          />
      ) : (
        // <ThemedView style={styles.listContainer}>
        //   <ThemedView style={styles.listWrapper}>
        //     {filteredFavorites.map((device: any) => (
        //       <DeviceCard device={device} key={device.id} />
        //     ))}
        //   </ThemedView>
        // </ThemedView>
        <View />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    height: "100%",
    paddingBottom: 200,
  },
  listWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  title: {
    paddingLeft: 10,
    fontSize: 15,
    textTransform: "uppercase",
    opacity: 0.6,
  },
});
