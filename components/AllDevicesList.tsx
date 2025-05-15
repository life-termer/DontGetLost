import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/context/GlobalContext";
import DeviceCard from "./DeviceCard";
import { ThemedText } from "./ThemedText";
import { ScanningState } from "./ScanningState";
import useBLE from "@/hooks/useBLE";

interface Device {
  id: string;
  name: string | null;
  // Add other device properties here
}

interface Props {
  devices: Device[];
  loadMoreDevices: () => void;
  isListEnd: boolean;
}

const PAGE_SIZE = 4; // Number of items to load per page

export default function AllDevicesList() {
  const { allDevices, sorting, search, isScanning } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { bluetoothState } = useBLE();
  const [isListEnd, setIsListEnd] = useState(false);
  //   console.log("AllDevicesList", allDevices);
  // const device = allDevices.find((device: any) => device.id === currentDevice);
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
  //Lazy loading for FlatList
  const paginatedDevices = filteredDevices.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextItems = filteredDevices.slice(0, nextPage * PAGE_SIZE);
      if (nextItems.length === paginatedDevices.length) {
        setIsListEnd(true);
      } else {
        setPage(nextPage);
      }
      setLoading(false);
    }, 1500);
  };

  const renderItem = useCallback(
    ({ item }: { item: Device }) => <DeviceCard device={item} />,
    []
  );

  const keyExtractor = useCallback((item: Device) => item.id, []);

  const ListFooterComponent = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingIndicator}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  };

  const ListHeader = useCallback(() => {
    return (isScanning || bluetoothState === "off") ? <ScanningState /> : null // Render your FavoritesHeader component here
  }, [bluetoothState, isScanning]);

  return (
    <>
      {allDevices.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          data={filteredDevices}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={false}
          ListHeaderComponent={ListHeader}
          // onEndReached={loadMore}
          // onEndReachedThreshold={10}
          // ListFooterComponent={ListFooterComponent}
        />
      ) : (
        /* {filteredDevices.map((device: any) => {
              return <DeviceCard device={device} key={device.id} />;
            })} */

        <View />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 16,
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
  loadingIndicator: {
    padding: 16,
    alignItems: "center",
  },
});
