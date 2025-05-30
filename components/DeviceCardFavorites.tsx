import {
  useContext,
  useState,
} from "react";
import {
  StyleSheet,
  TextInput,
  type TextProps,
  TouchableOpacity,
  View,
} from "react-native";

import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

export type DeviceCardProps = TextProps & {
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
    customName?: string;
    favoriteTimestamp?: number;
  };
};

export default function DeviceCardFavorites({
  lightColor,
  darkColor,
  device,
}: DeviceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(device.customName || ""); // Initialize with existing custom name

  const colorText = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorBlue = useThemeColor(
    { light: lightColor, dark: darkColor },
    "blue"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  const colorStatus = (distance: number | undefined) => {
    if (distance === undefined) {
      return colorIcon;
    }
    if (distance < 5) {
      return colorGreen;
    } else if (distance < 50) {
      return colorBlue;
    } else {
      return colorYellow;
    }
  };
  const colorRed = useThemeColor({ light: lightColor, dark: darkColor }, "red");
  const { setAllDevices, saveFavoriteDevices2, initialState } =
    useContext(GlobalContext);

  const handleDelete = (deviceId: string) => {
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

  const handleLongPress = () => {
    setIsEditing(true);
    console.log("Long Pressed", device.id);
  };

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

  const renderRightActions = () => (
    <TouchableOpacity
      style={[styles.deleteButton, { backgroundColor: colorRed }]}
      onPress={() => handleDelete(device.id)}
    >
      <FontAwesome name="trash" size={20} color="white" />
    </TouchableOpacity>
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity activeOpacity={0.6} onLongPress={handleLongPress}>
        <View style={[{ backgroundColor: colorBackground }, styles.container]}>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <View style={styles.rowContainer}>
              <View>
                {isEditing ? (
                  <TextInput
                    style={[
                      {
                        backgroundColor: colorBackground,
                        color: colorText,
                        borderColor: colorIcon,
                      },
                      styles.textInput,
                    ]}
                    value={customName || device.name}
                    onChangeText={handleNameChange}
                    onBlur={saveCustomName}
                    autoFocus
                  />
                ) : (
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: 14, lineHeight: 16 }}
                  >
                    {device.customName || device.customName || device.name}
                  </ThemedText>
                )}
                <ThemedText style={styles.baseText}>{device.id}</ThemedText>
                {device.customName && (
                  <ThemedText style={styles.baseText}>
                    Original: {device.name}
                  </ThemedText>
                )}
                {device.favoriteTimestamp && (
                  <ThemedText style={styles.baseText}>
                    Added: {formatDate(device.favoriteTimestamp)}
                  </ThemedText>
                )}
              </View>
              <View>
                {initialState || (
                  <View style={styles.columnContainer}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome
                        size={9}
                        name="circle"
                        color={colorStatus(
                          device.isOutOfRange ? undefined : device.distance
                        )}
                      />
                      <ThemedText
                        style={[
                          {
                            color: colorStatus(
                              device.isOutOfRange ? undefined : device.distance
                            ),
                          },
                          styles.baseText,
                        ]}
                      >
                        {device.isOutOfRange ? "Out of range" : "In range"}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[
                        { color: colorStatus(device.distance) },
                        styles.baseText,
                      ]}
                    >
                      <FontAwesome6 size={10} name="tower-broadcast" />{" "}
                      {device.isOutOfRange ? "-" : device.rssi} dBm
                    </ThemedText>

                    <ThemedText
                      style={[
                        { color: colorStatus(device.distance) },
                        styles.baseText,
                      ]}
                    >
                      {device.distance !== undefined ? (
                        <>
                          <FontAwesome6 size={10} name="ruler-horizontal" />{" "}
                          {device.isOutOfRange
                            ? "-"
                            : device.distance.toFixed(2)}{" "}
                          m
                        </>
                      ) : (
                        "Distance Unknown"
                      )}
                    </ThemedText>
                  </View>
                )}
              </View>
              {/* {device.isFavorite ? (
            <TouchableOpacity
              onPress={() => toggleFavorite(device.id)}>
                <FontAwesome
                  size={20}
                  name="star"
                  color={colorYellow}
                />
              </TouchableOpacity>
          ) : (
            <TouchableOpacity
            onPress={() => toggleFavorite(device.id)}>
              <FontAwesome6
                size={20}
                name="star"
                color={colorIcon}
              />
            </TouchableOpacity>
          )} */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 30,
  },

  baseText: {
    fontSize: 12,
    margin: 0,
    padding: 0,
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  textInput: {
    height: 24,
    borderWidth: 1,
    padding: 2,
    fontSize: 14,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },
});
