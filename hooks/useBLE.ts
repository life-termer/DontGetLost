/* eslint-disable no-bitwise */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";
import { throttle } from 'lodash';

import * as ExpoDevice from "expo-device";

// import base64 from "react-native-base64";

import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  ScanMode,
} from "react-native-ble-plx";
import { GlobalContext } from "@/context/GlobalContext";

const DATA_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const COLOR_CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1217";

const bleManager = new BleManager();

function useBLE() {
  const { allDevices, setAllDevices } = useContext(GlobalContext);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bluetoothState, setBluetoothState] = useState<"on" | "off">("off");
  const { isScanning, setIsScanning } = useContext(GlobalContext);

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

   // Create a buffer to hold discovered devices
   const deviceBuffer = useRef<Device[]>([]);

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

  const updateDeviceList = useCallback(
    (device: Device) => {
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
          location: existingDevice?.location, // Preserve existing location
        };

        if (existingIndex > -1) {
          // Replace existing device
          const updatedDevices = [...prevState];
          updatedDevices[existingIndex] = updatedDevice;
          console.log("Updating device:", device.id);
          return updatedDevices;
        } else {
          // Add new device
          console.log("Adding device to list:", device.id);
          return [...prevState, updatedDevice];
        }
      });
    },
    [setAllDevices, calculateDistance]
  );

  const debounce = useCallback(
    <T extends (...args: any[]) => void>(func: T, delay: number) => {
      const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

      return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          console.log("Debounced function executing"); // Add this line
          func(...args);
          timeoutRef.current = undefined;
        }, delay);
      };
    },
    []
  );

  const debouncedUpdateDeviceList = debounce((device: Device) => {
    updateDeviceList(device);
  }, 2000);

  const throttledUpdateDeviceList = useCallback(
    throttle((device: Device) => {
      updateDeviceList(device);
    }, 1000), // Adjust the interval as needed
    [updateDeviceList]
  );

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
            return;
          }

          if (true) {
            // Add the discovered device to the buffer
          deviceBuffer.current = [...deviceBuffer.current, device];
            // throttledUpdateDeviceList(device);
            // setAllDevices((prevState: any[]) => {
            //   const txPower = -50; // Replace with the actual TX power of your device
            //   const distance =
            //     device.rssi !== null
            //       ? calculateDistance(device.rssi, txPower)
            //       : -1;
            //   // console.log(distance + "m");

            //   const existingIndex = prevState.findIndex(
            //     (d: { id: string }) => d.id === device.id
            //   );

            //   const updatedDevice = {
            //     ...device,
            //     name: device.name || "Unknown Device",
            //     distance: distance,
            //     lastUpdated: Date.now(), // Add a timestamp for the last update
            //     lastSeen: Date.now(),
            //     isFavorite: prevState[existingIndex]?.isFavorite || false, // Preserve favorite status
            //     isOutOfRange: false, // Reset out-of-range status when the device is updated
            //     customName: prevState[existingIndex]?.customName || undefined, // Preserve customName
            //     favoriteTimestamp:
            //       prevState[existingIndex]?.favoriteTimestamp || undefined, // Preserve favoriteTimestamp
            //     location: prevState[existingIndex]?.location || undefined, // Preserve existing location
            //   };

            //   if (existingIndex > -1) {
            //     // Replace existing device
            //     const updatedDevices = [...prevState];
            //     updatedDevices[existingIndex] = updatedDevice;
            //     return updatedDevices;
            //   } else {
            //     // Add new device
            //     console.log("Adding device to list:", device.id);
            //     return [...prevState, updatedDevice];
            //   }
            // });
          }
        }
      );
    });
  };

   // Process the device buffer every X milliseconds
   useEffect(() => {
    const processBuffer = () => {
      if (deviceBuffer.current.length > 0) {
        console.log(
          "Processing device buffer:",
          deviceBuffer.current.length,
          "devices"
        );
        deviceBuffer.current.forEach((device) => updateDeviceList(device)); // Update the device list with each device in the buffer
        deviceBuffer.current = []; // Clear the buffer
      }
    };

    const intervalId = setInterval(processBuffer, 5000); // Process every 2 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [updateDeviceList]);


  // Periodically remove stale devices
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setAllDevices((prevState: any[]) => {
          const now = Date.now();
          return prevState
            .map((device) => {
              if (now - device.lastUpdated > 120000) {
                  // Mark devices as out of range
                  return {
                    ...device,
                    isOutOfRange: true,
                    distance: undefined,
                    rssi: undefined,
                  };
                
              }
              // Reset out-of-range status for devices that are updated
              return { ...device, isOutOfRange: false };
            })
            .filter(Boolean); // Remove null entries
        });
      }, 10000); // Check every second

      if(!isScanning) {
        clearInterval(interval); // Stop checking when not scanning
      }

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isScanning]);

  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };



  const clearAll = async () => {
    setAllDevices([]);
    console.log("Cleared all devices");
    try {
      // Disconnect the currently connected device
      if (connectedDevice) {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        console.log(`Disconnected from device: ${connectedDevice.id}`);
      }

      // Clear the list of all devices
    } catch (error) {
      console.log("Error clearing devices:", error);
    }
    setConnectedDevice(null);
  };

  // Get GPS location
  useEffect(() => {
    const getLocation = async () => {
      console.log("Location interval started");
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setAllDevices((prevDevices: any[]) => {
          return prevDevices.map((device) => {
            if (device.isFavorite && !device.isOutOfRange) {
              return {
                ...device,
                
                location: {
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                },
              };
            }
            return device;
          });
        });
      } catch (error) {
        console.log("Error getting location", error);
      }
    };

    getLocation(); // Get initial location
    const intervalId = setInterval(getLocation, 60000);
    if(!isScanning) {
      clearInterval(intervalId); // Update every 30 seconds
      console.log("Location interval stopped");
    }
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [isScanning]);

  return {
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    bluetoothState,
  };
}

export default useBLE;
