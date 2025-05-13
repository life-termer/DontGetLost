import { createContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { Device } from "react-native-ble-plx";
import * as Location from "expo-location"
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
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  currentDevice: any;
  setCurrentDevice: (value: any) => void;
  search: string,
  setSearch: (value: string) => void;
  location: Location.LocationObject | null;
  setLocation: (value: Location.LocationObject) => void;
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
  isModalVisible: false,
  setIsModalVisible: () => {},
  currentDevice: null,
  setCurrentDevice: () => {},
  search: "",
  setSearch: () => {},
  location: null,
  setLocation:  () => {},

});

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [sorting, setSorting] = useState("asc");
  const [search, setSearch] = useState("");
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [favoriteDevices, setFavoriteDevices] = useState<any[]>([]);
  const [initialState, setInitialState] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
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
            isOutOfRange: true,
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
        isModalVisible,
        setIsModalVisible,
        currentDevice,
        setCurrentDevice,
        search,
        setSearch,
        location,
        setLocation
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
