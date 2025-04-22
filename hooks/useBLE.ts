/* eslint-disable no-bitwise */
import { useContext, useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

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
  // const [allDevices, setAllDevices] = useState<Device[]>([]);
  const { allDevices, setAllDevices } = useContext(GlobalContext);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bluetoothState, setBluetoothState] = useState<"on" | "off">("off");
  const { isScanning, setIsScanning } = useContext(GlobalContext);

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

  const connectToDevice = async (device: Device) => {
    let isConnected = false;
    const maxRetries = 5; // Maximum number of retries
    let attempt = 0;

    while (!isConnected && attempt < maxRetries) {
      try {
        console.log(`Attempting to connect... (Attempt ${attempt + 1})`);
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        console.log("Connected to Device", deviceConnection);
        bleManager.stopDeviceScan();
        deviceConnection.onDisconnected((error, device) => {
          console.log("Device disconnected");
          // Optionally, you can trigger a reconnection attempt here
        });

        // Read all characteristics after connecting
        readAllCharacteristics(deviceConnection);

        isConnected = true; // Set flag to true if connection is successful
      } catch (e) {
        console.log("Failed to connect, retrying...", e);
        attempt += 1;
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait before retrying
      }
    }

    if (!isConnected) {
      console.log("Failed to connect after maximum retries");
    }
  };
  const readAllCharacteristics = async (device: Device) => {
    try {
      const services = await device.services();

      for (const service of services) {
        const characteristics = await service.characteristics();

        for (const characteristic of characteristics) {
          try {
            const value = await characteristic.read();
            // console.log(characteristic);

            if (value.value) {
              // Decode the Base64 value using atob
              const decodedValue = atob(value.value);

              // Example: Convert the decoded value to a string
              console.log(
                `Characteristic ${characteristic.uuid} string value: ${decodedValue}`
              );

              // If you need to convert to an integer, you can parse the string
              // Example: Convert the first 4 bytes to an integer
              const intValue = new DataView(
                Uint8Array.from(decodedValue, (c) => c.charCodeAt(0)).buffer
              ).getInt32(0, false);
              // Example of logging the UUID
              // console.log(`Characteristic UUID: ${characteristic.uuid}`);

              // Example of mapping UUID to a human-readable name

              console.log(
                `Characteristic ${characteristic.uuid} integer value: ${intValue}`
              );

              // Add more decoding logic as needed based on your characteristic's data format
              const characteristicNames: { [key: string]: string } = {
                "00002a00-0000-1000-8000-00805f9b34fb": "Device Name",
                "00002a01-0000-1000-8000-00805f9b34fb": "Appearance",
                // Add more UUIDs and their corresponding names as needed
              };

              // const characteristicName =
              //   characteristicNames[characteristic.uuid] ||
              //   "Unknown Characteristic";
              // console.log(`Characteristic Name: ${characteristicName}`);
            } else {
              console.log(`Characteristic ${characteristic.uuid} has no value`);
            }
          } catch (readError) {
            console.log(
              `Failed to read characteristic ${characteristic.uuid}: ${readError}`
            );
          }
        }
      }
    } catch (error) {
      console.log("Failed to discover services and characteristics", error);
    }
  };
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

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

  const scanForPeripherals = () => {
    bleManager.state().then((state) => {
      if (state !== "PoweredOn") {
        console.log("Bluetooth is not enabled, current state:", state);
        return;
      }

      console.log("Starting device scan...");
      setIsScanning(true);
      bleManager.startDeviceScan(
        null,
        {
          allowDuplicates: false,
          scanMode: ScanMode.LowLatency,
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

          // Adjust these conditions based on your needs
          const isTargetDevice =
            device.id === "BC:57:29:05:DC:16" || device.name !== null;
          // console.log("Discovered device:", device);
          if (true) {
            setAllDevices((prevState: any[]) => {
              const txPower = -50; // Replace with the actual TX power of your device
              const distance =
                device.rssi !== null
                  ? calculateDistance(device.rssi, txPower)
                  : -1;
              // console.log(distance + "m");

              const existingIndex = prevState.findIndex(
                (d: { id: string }) => d.id === device.id
              );

              const updatedDevice = {
                ...device,
                name: device.name || "Unknown Device",
                distance: distance,
                lastUpdated: Date.now(), // Add a timestamp for the last update
                isFavorite: prevState[existingIndex]?.isFavorite || false, // Preserve favorite status
                isOutOfRange: false, // Reset out-of-range status when the device is updated
              };

              if (existingIndex > -1) {
                // Replace existing device
                const updatedDevices = [...prevState];
                updatedDevices[existingIndex] = updatedDevice;
                return updatedDevices;
              } else {
                // Add new device
                console.log("Adding device to list:", device.id);

                console.log("Device RSSI:", device.rssi);
                return [...prevState, updatedDevice];
              }
            });
          }
        }
      );
    });
  };

  // Periodically remove stale devices
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setAllDevices((prevState: any[]) => {
          const now = Date.now();
          return prevState
            .map((device) => {
              if (now - device.lastUpdated > 10000) {
                if (device.isFavorite) {
                  // Mark favorite devices as out of range
                  return { ...device, isOutOfRange: true };
                } else {
                  // Remove non-favorite devices
                  return null;
                }
              }
              // Reset out-of-range status for devices that are updated
              return { ...device, isOutOfRange: false };
            })
            .filter(Boolean); // Remove null entries
        });
      }, 1000); // Check every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isScanning]);

  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };
  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        COLOR_CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
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

  return {
    connectToDevice,
    // allDevices,
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    startStreamingData,
    clearAll,
    bluetoothState,
  };
}

export default useBLE;
