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
  initialState: boolean;
  setInitialState: (value: boolean) => void;
  saveFavoriteDevices2: (devices: any[]) => Promise<void>;
  sorting: string;
  setSorting: (value: string) => void;
}>({
  isScanning: false,
  setIsScanning: () => {},
  allDevices: [],
  setAllDevices: () => {},
  favoriteDevices: [],
  setFavoriteDevices: () => {},
  initialState: false,
  setInitialState: () => {},
  saveFavoriteDevices2: async () => {},
  sorting: "asc",
  setSorting: () => {},
});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [sorting, setSorting] = useState("asc");
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [favoriteDevices, setFavoriteDevices] = useState<any[]>([]);
  const [initialState, setInitialState] = useState(true);
  console.log("initialState", initialState);
  console.log("isScanning", isScanning);
  const saveFavoriteDevices2 = async (devices: any[]) => {
    console.log("Starting saving favorite devices to storage");
    try {
      await AsyncStorage.setItem("favoriteDevices", JSON.stringify(devices));
    } catch (error) {
      console.log("Failed to save favorite devices to storage", error);
    }
  };

  useEffect(() => {
    const loadFavoriteDevices = async () => {
      console.log("Starting loading favorite devices from storage");
      try {
        const storedFavorites = await AsyncStorage.getItem("favoriteDevices");
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          const favorites = parsedFavorites.filter(
            (device: any) => device.isFavorite
          );
          console.log("Parsed favorites", favorites);
          const updatedFavorites = favorites.map((device: any) => ({
            ...device,
            rssi: 0,
            distance: undefined,
          }));
          setAllDevices(favorites);
        }
      } catch (error) {
        console.log("Failed to load favorite devices from storage", error);
      }
      console.log("Finished loading favorite devices from storage");
    };

    loadFavoriteDevices();
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
        initialState,
        setInitialState,
        saveFavoriteDevices2,
        sorting,
        setSorting,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
