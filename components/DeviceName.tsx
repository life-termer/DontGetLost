import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  type TextProps,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { memo, useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import { Octicons } from "@expo/vector-icons";

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

function DeviceNameComponent({ lightColor, darkColor, device }: Props) {
  const { setAllDevices, saveFavoriteDevices2 } = useContext(GlobalContext);

  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(
    device.customName || device.name
  );

  const handleNameChange = (text: string) => {
    setCustomName(text);
  };

  const saveCustomName = () => {
    setAllDevices((prevDevices: any[]) => {
      const updatedDevices = prevDevices.map((d) =>
        d.id === device.id ? { ...d, customName: customName } : d
      );
      saveFavoriteDevices2(updatedDevices);
      return updatedDevices;
    });
    setIsEditing(false);
  };

  const colorText = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorBackgroundLight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

    useEffect(() => {
      setCustomName(device.customName || device.name);
    }, [isEditing, device.customName, device.name]);

  return (

    <TouchableOpacity
      onPress={() => setIsEditing(true)}
      style={[styles.rowContainer]}
    >
      {isEditing ? (
        <>
        <TextInput
          style={[
            {
              backgroundColor: colorBackground,
              color: colorText,
            },
            styles.textInput,
          ]}
          value={customName}
          onChangeText={handleNameChange}
          onBlur={saveCustomName}
          autoFocus
        />
        </>
      ) : (
        <>
        <ThemedText style={styles.textInput}>
          {device.customName || device.name}
        </ThemedText>
        <Octicons name="pencil" size={15} color={colorIcon} style={{paddingHorizontal: 20}} />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    margin: "auto",
    fontFamily: "MontserratSemiBold",
    fontSize: 15,
    lineHeight: 16,
  },
});

const DeviceName = memo(DeviceNameComponent);
export default DeviceName;