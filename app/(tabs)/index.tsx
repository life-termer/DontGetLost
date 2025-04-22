import {
  StyleSheet,
  Button,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { getUsers } from "@/scripts/firebase-data";
import useBLE from "@/hooks/useBLE";
import CustomScrollView from "@/components/CustomScrollView";
import { ScanControl } from "@/components/ScanControl";

export default function HomeScreen() {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    clearAll,
  } = useBLE();
  console.log(allDevices);
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
  // console.log('allDevices', allDevices)
  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/react-logo.png")}
    //       style={styles.reactLogo}
    //       resizeMode="contain"
    //     />
    //   }
    // >
    <CustomScrollView>
      <ThemedView style={styles.titleContainer}>
        <ScanControl />
        {/* <ThemedText type="title">{`Welcome${
          user ? `, ${user.name}!` : "!"
        }`}</ThemedText>
        <HelloWave />
        {user && (
          <ThemedText type="subtitle">
            You are logged with email: {user.email}
          </ThemedText>
        )} */}
      </ThemedView>
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Bluetooth Scan Test</ThemedText>
        <ThemedText>Bluetooth Scan Test</ThemedText>
        <ThemedView style={styles.rowContainer}>
          <Button title="Sign in" onPress={onPressGetUser} />
          <Pressable
            style={({ pressed }: { pressed: boolean }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => console.log("button pressed")}
          >
            <ThemedText style={styles.buttonPrimary}>Press me</ThemedText>
          </Pressable>
          <Button
            title="Sign out"
            onPress={() => {
              setUser(undefined);
            }}
          />
        </ThemedView> *
        <Button title="Clear All" onPress={clearAll} color={"#000"} />
        <Button title="Scan for devices" onPress={scanForDevices} />
        <Button title="Stop Scan" onPress={stopScanForPeripherals} />


      </ThemedView> */}
      {connectedDevice && (
        <ThemedView style={styles.textStepContainer}>
          <ThemedText type="subtitle">
            Connected to {connectedDevice.name}
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.textStepContainer}>
        {allDevices.map((device: any) => (
          <TouchableOpacity
            style={[
              styles.textStepContainer,
              !device.isConnectable && styles.disabled,
            ]}
            key={device.id}
            onPress={() => connect(device)}
          >
            <ThemedText type="subtitle">{device.name}</ThemedText>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <ThemedText style={styles.baseText}>{device.id}</ThemedText>
              <ThemedText style={styles.baseText}>
                MTU: {device.mtu} RSSI: {device.rssi}
              </ThemedText>
            </View>
            <ThemedText type="subtitle">
              {device.distance !== undefined
                ? "Distance :" + device.distance.toFixed(2) + " m"
                : "Distance Unknown"}
            </ThemedText>
            <View
              style={{
                height: 20,
                borderBottomColor: "#fff",
                borderBottomWidth: 1,
              }}
            />
          </TouchableOpacity>
        ))}
      </ThemedView>
      <ThemedView style={styles.stepContainer}></ThemedView>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 30,
  },
  textStepContainer: {
    gap: 2,
    marginBottom: 30,
  },
  buttonWrapper: {
    width: 100,
    height: 40,
    display: "flex",
    justifyContent: "center",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    backgroundColor: "#be4e4e",
  },
  buttonPressed: {
    backgroundColor: "#aa4646",
    color: "#b3b3b3",
  },
  buttonPrimary: {
    fontFamily: "OpenSans",
    color: "#ffffff",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  baseText: {
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
});
