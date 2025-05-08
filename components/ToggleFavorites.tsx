import { type TextProps, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  device: {
    id: string;
    name: string;
    isConnectable: boolean;
    mtu: number;
    rssi: number;
    distance?: number;
    isFavorite: boolean;
    isOutOfRange: boolean;
    customName: string;
  };
};

export default function ToggleFavorites({ lightColor, darkColor, device }: Props) {
  const { saveFavoriteDevices2, setAllDevices } = useContext(GlobalContext);

  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
 
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );

  const toggleFavorite = (deviceId: string) => {
    setAllDevices((prevState: any[]) => {
      const updatedDevices = prevState.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              isFavorite: !device.isFavorite,
              favoriteTimestamp: !device.isFavorite ? Date.now() : null,
            }
          : device
      );
      // Save the updated devices after toggling the favorite status
      saveFavoriteDevices2(updatedDevices);
      return updatedDevices;
    });
  };
  
  return (
    <View>
      {device.isFavorite ? (
        <TouchableOpacity
          onPress={() => toggleFavorite(device.id)}
          style={{ width: 22, height: 22 }}
        >
          <FontAwesome size={22} name="star" color={colorYellow} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => toggleFavorite(device.id)}
          style={{ width: 22, height: 22 }}
        >
          <FontAwesome6 size={20} name="star" color={colorIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}