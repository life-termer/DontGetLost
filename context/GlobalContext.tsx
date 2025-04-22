import { createContext, useState } from "react";
import { ReactNode } from "react";
import { Device } from "react-native-ble-plx";

export const GlobalContext = createContext<{
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  allDevices: any[];
  setAllDevices: (devices: any[]) => void;
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
  //authInitialState can be whatever you want, ex: {rand: {}, rand2: null}
  const [isScanning, setIsScanning] = useState(false);
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [favoriteDevices, setFavoriteDevices] = useState<any[]>([]);

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
