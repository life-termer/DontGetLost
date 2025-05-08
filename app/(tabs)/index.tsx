import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import { useContext, useState } from "react";
import { getUsers } from "@/scripts/firebase-data";
import useBLE from "@/hooks/useBLE";
import { GlobalContext } from "@/context/GlobalContext";
import AllDevicesList from "@/components/AllDevicesList";
import FavoriteDevicesList from "@/components/FavoriteDevicesList";
import { Colors }from "@/constants/Colors";
import ModalInfo from "@/components/ModalInfo";

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

  const colorScheme = useColorScheme();

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
    <View style={{ backgroundColor:  Colors[colorScheme ?? "light"].background, minHeight: "100%" }}>
      <SubHeader />
      <ScrollView>
        {/* <FavoriteDevicesList tab="index" /> */}
        <AllDevicesList />
      </ScrollView>
      </View>
  );
}

