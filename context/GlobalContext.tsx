import { createContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { Device } from "react-native-ble-plx";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GlobalContext = createContext<{
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  allDevices: Device[];
  setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  favoriteDevices: any[];
  setFavoriteDevices: (devices: any[]) => void;
}>({
  isScanning: false,
  setIsScanning: () => {},
  allDevices: [],
  setAllDevices: () => {},
  favoriteDevices: [],
  setFavoriteDevices: () => {},
});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [favoriteDevices, setFavoriteDevices] = useState<any[]>([]);

  useEffect(() => {
    const loadFavoriteDevices = async () => {
      console.log("Starting loading favorite devices from storage");
      try {
        const storedFavorites = await AsyncStorage.getItem("favoriteDevices");
        if (storedFavorites) {
          setFavoriteDevices(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log("Failed to load favorite devices from storage", error);
      }
      console.log("Finished loading favorite devices from storage");
    };

    loadFavoriteDevices();
  }, []);

  useEffect(() => {
    const saveFavoriteDevices = async () => {
      console.log("Starting saving favorite devices to storage");
      try {
        await AsyncStorage.setItem(
          "favoriteDevices",
          JSON.stringify(favoriteDevices)
        );
      } catch (error) {
        console.log("Failed to save favorite devices to storage", error);
      }
    };

    saveFavoriteDevices();
    console.log("favoriteDevices", favoriteDevices);
  }, [favoriteDevices]);

  useEffect(() => {
    // Update allDevices with favorite status from loaded favoriteDevices
    console.log("Starting to update allDevices with favorite status");
    setAllDevices((prevAllDevices) => {
      return prevAllDevices.map((device) => {
        const isFavorite = favoriteDevices.some(
          (favDevice) => favDevice.id === device.id
        );
        return {
          ...device,
          isFavorite: isFavorite, // Set isFavorite based on existence in favoriteDevices
          favoriteTimestamp: isFavorite
            ? favoriteDevices.find((favDevice) => favDevice.id === device.id)
                ?.favoriteTimestamp
            : null, // Set timestamp if it exists
          customName: isFavorite
            ? favoriteDevices.find((favDevice) => favDevice.id === device.id)
                ?.customName
            : null, // Set customName if it exists
        };
      });
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isScanning,
        setIsScanning,
        allDevices,
        setAllDevices,
        favoriteDevices,
        setFavoriteDevices,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
