import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useContext, useState } from "react";
import { getUsers } from "@/scripts/firebase-data";
import useBLE from "@/hooks/useBLE";
import CustomScrollView from "@/components/CustomScrollView";
import { ScanControl } from "@/components/ScanControl";
import { BluetoothState } from "@/components/BluetoothState";
import { GlobalContext } from "@/context/GlobalContext";
import AllDevicesList from "@/components/AllDevicesList";
import FavoriteDevicesList from "@/components/FavoriteDevicesList";

export default function HomeScreen() {
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
  const { allDevices, setAllDevices } = useContext(GlobalContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  interface UserInt {
    name: string;
    email: string;
  }
  const [user, setUser] = useState<UserInt>();
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const connect = async (device: any) => {
    connectToDevice(device);
  };
  const onPressGetUser = () => {
    getUsers().then((users) => {
      setUser(users[1] as UserInt);
    });
  };
  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <BluetoothState />
        <ScanControl />
      </ThemedView>
      <CustomScrollView>
        <FavoriteDevicesList />
        <AllDevicesList />
      </CustomScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#fff ",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    textAlign: "center",
    padding: 26,
  },
});
