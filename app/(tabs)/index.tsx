import { ScrollView, useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import { useContext, useState } from "react";
import { getUsers } from "@/scripts/firebase-data";
import AllDevicesList from "@/components/AllDevicesList";
import { Colors } from "@/constants/Colors";
import { ScanningState } from "@/components/ScanningState";
import { GlobalContext } from "@/context/GlobalContext";
import useBLE from "@/hooks/useBLE";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { bluetoothState } = useBLE();

  interface UserInt {
    name: string;
    email: string;
  }
  const [user, setUser] = useState<UserInt>();

  const onPressGetUser = () => {
    getUsers().then((users) => {
      setUser(users[1] as UserInt);
    });
  };
  const { isScanning } = useContext(GlobalContext);

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <SubHeader tab="index" />
      <ScrollView>
        {isScanning || bluetoothState === "off" ? <ScanningState /> : null}
        <AllDevicesList />
      </ScrollView>
    </View>
  );
}
