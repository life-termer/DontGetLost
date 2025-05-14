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
  updateInterval: number | null;
  setUpdateInterval: (value: number | null) => void;
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
  updateInterval: 10000,
  setUpdateInterval: () => {},
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
  const [updateInterval, setUpdateInterval] = useState<number | null>(10000);

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
          setAllDevices(updatedFavorites);
          setFavoriteDevices(updatedFavorites);
        }
      } catch (error) {
        console.log("Failed to load favorite devices from storage", error);
      }
      console.log("Finished loading favorite devices from storage");
    };
    const loadUpdateInterval = async () => {
      try {
        const storedInterval = await AsyncStorage.getItem('updateInterval');
        if (storedInterval !== null) {
          setUpdateInterval(parseInt(storedInterval, 10));
        }
      } catch (e) {
        console.log("Error loading update interval from storage", e);
      }
    };

    loadFavoriteDevices();
    loadUpdateInterval();
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
        setLocation,
        updateInterval,
        setUpdateInterval
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
