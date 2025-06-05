/* eslint-disable no-bitwise */
import { useContext, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";

import { BleManager, Device, ScanMode } from "react-native-ble-plx";
import { GlobalContext } from "@/context/GlobalContext";

const DATA_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const COLOR_CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1217";

const bleManager = new BleManager();

function useBLE() {
  const { allDevices, setAllDevices } = useContext(GlobalContext);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bluetoothState, setBluetoothState] = useState<"on" | "off">("off");
  const { isScanning, setIsScanning, location, setLocation, updateInterval } =
    useContext(GlobalContext);

  // Create a buffer to hold discovered devices
  const deviceBuffer = useRef<Device[]>([]);
  const [restart, setRestart] = useState(false);

  bleManager.onStateChange((state) => {
    if (state === "PoweredOn") {
      setBluetoothState("on");
    } else {
      setBluetoothState("off");
    }
  }, true);

  const requestAndroid31Permissions = async () => {
    console.log("requestAndroid31Permissions");
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineCoarsePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted" &&
      fineCoarsePermission === "granted"
    );
  };

  const requestPermissions = async () => {
    console.log(ExpoDevice.platformApiLevel);
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const calculateDistance = (rssi: number, txPower: number) => {
    if (rssi === 0) {
      return -1.0; // Unknown
    }

    const ratio = (rssi * 1.0) / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      const distance = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
      return distance;
    }
  };

  const updateDeviceList = (device: Device, location: any) => {
    const txPower = -50; // Replace with the actual TX power of your device
    const distance =
      device.rssi !== null ? calculateDistance(device.rssi, txPower) : -1;
    setAllDevices((prevState: any[]) => {
      const existingIndex = prevState.findIndex(
        (d: { id: string }) => d.id === device.id
      );
      const existingDevice = prevState[existingIndex];

      const updatedDevice = {
        ...device,
        name: device.name || "Unknown Device",
        distance: distance,
        lastUpdated: Date.now(), // Add a timestamp for the last update
        lastSeen: Date.now(),
        isFavorite: prevState[existingIndex]?.isFavorite || false, // Preserve favorite status
        isOutOfRange: false, // Reset out-of-range status when the device is updated
        customName: prevState[existingIndex]?.customName || undefined, // Preserve customName
        favoriteTimestamp:
          prevState[existingIndex]?.favoriteTimestamp || undefined, // Preserve favoriteTimestamp
        // location: existingDevice?.location, // Preserve existing location
        location: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        },
        possibleOffline: false,
      };
      if (existingIndex > -1) {
        // Replace existing device
        const updatedDevices = [...prevState];
        updatedDevices[existingIndex] = updatedDevice;
        return updatedDevices;
      } else {
        // Add new device
        console.log("Adding device to list:", device.id);
        return [...prevState, updatedDevice];
      }
    });
  };


  // const throttledUpdateDeviceList = useCallback(
  //   throttle((device: Device) => {
  //     updateDeviceList(device);
  //   }, 1000), // Adjust the interval as needed
  //   [updateDeviceList]
  // );


  const scanForPeripherals = () => {
    bleManager.state().then((state) => {
      if (state !== "PoweredOn") {
        console.log("Bluetooth is not enabled, current state:", state);
        return;
      }
      console.log("Starting device scan...");
      bleManager.startDeviceScan(
        null,
        {
          allowDuplicates: false,
          // scanMode: ScanMode.LowLatency,
          scanMode: ScanMode.LowPower,
        },
        (error, device) => {
          if (error) {
            console.log("Scanning error:", error);
            setIsScanning(false);
            return;
          }

          if (!device) {
            console.log("No devices");
            return;
          }

          if (true) {
            // Add the discovered device to the buffer
            deviceBuffer.current = [...deviceBuffer.current, device];
            // console.log("Devices being added to buffer...");
            // updateDeviceList(device, location);
            // throttledUpdateDeviceList(device);
          }
        }
      );
    });
  };

  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
    // setIsScanning(false);
  };

  // Restart scanning in X milliseconds
  // useEffect(() => {
  //   let scanTimeout: NodeJS.Timeout | null = null;

  //   const startScanning = () => {
  //     if (isScanning) {
  //       bleManager.stopDeviceScan();
  //       scanForPeripherals();
  //       console.log("Stopping and restarting scan...");
  //     }
  //   };

  //   if (isScanning) {
  //     scanTimeout = setInterval(startScanning, 10000);
  //   }
  //   if (!isScanning) {
  //     if (scanTimeout) {
  //       clearInterval(scanTimeout);
  //       console.log("Cleared scan interval");
  //     }
  //   }
  //   return () => {
  //     if (scanTimeout) {
  //       clearInterval(scanTimeout);
  //       console.log("Cleared scan interval");
  //     }
  //     // bleManager.stopDeviceScan();
  //   };
  // }, [restart]);

  // Process the device buffer every X milliseconds
  useEffect(() => {
    const processBuffer = async () => {
      // await getLocation();
      if (deviceBuffer.current.length > 0) {
        console.log(
          "Processing device buffer:",
          deviceBuffer.current.length,
          "devices"
        );
        deviceBuffer.current.forEach((device) =>
          updateDeviceList(device, location)
        ); // Update the device list with each device in the buffer
        deviceBuffer.current = []; // Clear the buffer
      }
    };
    let intervalId: NodeJS.Timeout | null = null;
    if (isScanning) {
      intervalId = setInterval(
        processBuffer,
        updateInterval ? updateInterval : 10000
      );
    }
    return () => {
      if (intervalId !== null) {
        deviceBuffer.current = [];
        clearInterval(intervalId); // Cleanup interval on unmount
        console.log("Clear device buffer processing interval");
      }
    };
  }, [updateInterval, isScanning]);

  
  return {
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    bluetoothState,
  };
}

export default useBLE;
