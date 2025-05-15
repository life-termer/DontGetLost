import { useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import { useCallback, useContext, useEffect, useState } from "react";
import AllDevicesList from "@/components/AllDevicesList";
import { Colors } from "@/constants/Colors";
import * as ScreenOrientation from "expo-screen-orientation";
export default function HomeScreen() {
  const colorScheme = useColorScheme();

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
      <View style={{ height: "100%", paddingBottom: 150 }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <AllDevicesList />
      </View>
    </View>
  );
}
