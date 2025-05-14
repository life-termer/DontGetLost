import { useCallback, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { GlobalContext } from "@/context/GlobalContext";
import DeviceCard from "./DeviceCard";

interface Device {
  id: string;
  name: string;
  // Add other device properties here
}

interface Props {
  devices: Device[];
  loadMoreDevices: () => void;
  isListEnd: boolean;
}

export default function AllDevicesList() {
  const { allDevices, sorting, search } = useContext(GlobalContext);
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

  return (
    <>
      {allDevices.length > 0 ? (
        <ThemedView style={styles.listContainer}>
          <ThemedView style={styles.listWrapper}>
            {/* <FlatList
              data={filteredDevices}
              renderItem={({ item }) => <DeviceCard device={item} />}
              keyExtractor={(item) => item.id}
            /> */}
            {filteredDevices.map((device: any) => {
              return <DeviceCard device={device} key={device.id} />;
            })}
          </ThemedView>
          {/* {device && <ModalInfo device={device} />} */}
        </ThemedView>
      ) : (
        <View />
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
