import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  type TextProps,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import SaveModalBtn from "./SaveModalBtn";
import ToggleFavorites from "./ToggleFavorites";

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  device: any;
};

export default function ModalInfo({ lightColor, darkColor, device }: Props) {
  const { isModalVisible, setIsModalVisible, setAllDevices, saveFavoriteDevices2 } = useContext(GlobalContext);
  const [deviceName, onChangeText] = useState(device.customName || device.name);

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  const onSave = () => {
    saveCustomName();
    setIsModalVisible(false);
  };

  const saveCustomName = () => {
    setAllDevices((prevDevices: any[]) => {
      const updatedDevices = prevDevices.map((d) =>
        d.id === device.id ? { ...d, customName: deviceName } : d
      );
      saveFavoriteDevices2(updatedDevices);
      return updatedDevices;
    });
  };

  const colorOverlay = useThemeColor(
    { light: lightColor, dark: darkColor },
    "overlay"
  );
  const colorIcon = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );
  const colorGreen = useThemeColor(
    { light: lightColor, dark: darkColor },
    "green"
  );
  const colorBorder = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border"
  );
  const colorYellow = useThemeColor(
    { light: lightColor, dark: darkColor },
    "yellow"
  );
  const colorText = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const colorBackgroundLight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundLight"
  );

  useEffect(() => {
    onChangeText(device.customName || device.name);
  }, [isModalVisible]);
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <View style={[{backgroundColor: colorOverlay,},styles.modalContent]}>
          <View
            style={[
              { backgroundColor: colorBackgroundLight },
              styles.modalContentInner,
            ]}
          >
            <ScrollView style={{ paddingHorizontal: 20 }}>
              <View style={styles.titleContainer}>
                <View style={styles.rowContainer}>
                  <ThemedText type="subtitle" style={styles.title}>
                    Device Details
                  </ThemedText>
                  <TouchableOpacity
                    onPress={onModalClose}
                    style={{ paddingHorizontal: 10 }}
                  >
                    <MaterialIcons name="close" size={22} color={colorIcon} />
                  </TouchableOpacity>
                </View>
                <ThemedText style={[{ marginBottom: 16 }, styles.subtitle]}>
                  View and edit details for this Bluetooth device.
                </ThemedText>
              </View>
              <ThemedText
                type="subtitle"
                style={[{ marginBottom: 0 }, styles.subtitle]}
              >
                Device ID
              </ThemedText>
              <TextInput
                style={[{ borderColor: colorBorder, backgroundColor: colorBackground, color: colorText }, styles.input]}
                value={device.id}
                editable={false}
              />
              <ThemedText
                type="subtitle"
                style={[{ marginBottom: 0 }, styles.subtitle]}
              >
                Custom Name
              </ThemedText>
              <TextInput
                style={[{ borderColor: colorBorder, color: colorText }, styles.input]}
                onChangeText={onChangeText}
                value={deviceName}
              />
              <ThemedText
                type="subtitle"
                style={[{ marginBottom: 0 }, styles.subtitle]}
              >
                Group
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={[{ marginBottom: 20 }, styles.subtitle]}
              >
                None
              </ThemedText>
              <ThemedText style={[{ marginBottom: 16 }, styles.textSm]}>
                Signal strength and distance update automatically when scanning
              </ThemedText>
              <View
                style={[
                  {
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: 30,
                  },
                  styles.rowContainer,
                ]}
              >
                <View
                  style={[
                    { backgroundColor: colorBackground },
                    styles.dataContainer,
                  ]}
                >
                  <FontAwesome6 name="signal" size={20} color={colorGreen} />
                  <View>
                    <ThemedText
                      type="subtitle"
                      style={[{ marginBottom: 5 }, styles.baseText]}
                    >
                      Signal
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.baseText]}
                    >
                      {device.rssi} dBm
                    </ThemedText>
                  </View>
                </View>
                <View
                  style={[
                    { backgroundColor: colorBackground },
                    styles.dataContainer,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker-distance"
                    color={colorYellow}
                    size={20}
                  />
                  <View>
                    <ThemedText
                      type="subtitle"
                      style={[{ marginBottom: 5 }, styles.baseText]}
                    >
                      Distance
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.baseText]}
                    >
                      ~{device.distance?.toFixed(2)}m
                    </ThemedText>
                  </View>
                </View>
              </View>
              <View style={[{marginBottom: 20},styles.rowContainer]}>
                <View style={{ width: "90%" }}>
                  <SaveModalBtn onSave={onSave} />
                </View>
                <ToggleFavorites device={device} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "100%",
    width: "100%",
    
    position: "absolute",
    left: 0,
  },
  modalContentInner: {
    position: "relative",
    borderRadius: 10,
    marginHorizontal: 16,
    height: "auto",
    maxHeight: "85%",
    transform: [
      {
        translateY: "-50%",
      },
    ],
    top: "50%",
  },
  titleContainer: {
    height: "10%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: 25,
    marginBottom: 30,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
  },
  textSm: {
    fontSize: 12,
    lineHeight: 14,
  },
  baseText: {
    fontSize: 13,
    lineHeight: 16,
  },
  dataContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    flexBasis: "48%",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    fontSize: 15,
    padding: 10,
    borderRadius: 8,
    fontFamily: "OpenSansSemiBold",
  },
});
