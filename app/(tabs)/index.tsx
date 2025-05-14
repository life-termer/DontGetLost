import { ScrollView, RefreshControl, useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import { useCallback, useContext, useEffect, useState } from "react";
import { getUsers } from "@/scripts/firebase-data";
import AllDevicesList from "@/components/AllDevicesList";
import { Colors } from "@/constants/Colors";
import { ScanningState } from "@/components/ScanningState";
import { GlobalContext } from "@/context/GlobalContext";
import useBLE from "@/hooks/useBLE";
import * as ScreenOrientation from "expo-screen-orientation";
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { bluetoothState } = useBLE();
  const [page, setPage] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const wait = (timeout: any) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    const unlockOrientation = async () => {
      await ScreenOrientation.unlockAsync(); // Enable all orientations
    };

    unlockOrientation();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait on unmount
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <SubHeader tab="index" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isScanning || bluetoothState === "off" ? <ScanningState /> : null}
        <AllDevicesList />
      </ScrollView>
    </View>
  );
}
