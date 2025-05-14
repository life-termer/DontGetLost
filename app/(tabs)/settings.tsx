import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { GlobalContext } from "@/context/GlobalContext";
import { ThemedText } from "@/components/ThemedText";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const colorScheme = useColorScheme();
  const { updateInterval, setUpdateInterval } = useContext(GlobalContext);
  const [value, setValue] = useState(updateInterval);

  const handleUpdateIntervalChange = (value: number) => {
    setUpdateInterval(value);
  };

  const styles = StyleSheet.create({
    sliderContainer: {
      padding: 16,
      alignItems: "center",
    },
  });
  useEffect(() => {
    const saveUpdateInterval = async (value: number) => {
      try {
        await AsyncStorage.setItem("updateInterval", value.toString());
      } catch (e) {
        console.log("Error saving update interval to storage", e);
      }
    };

    if (updateInterval !== null) {
      saveUpdateInterval(updateInterval);
    }
  }, [updateInterval]);

  return (
    <ScrollView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <View style={styles.sliderContainer}>
        <ThemedText>
          Update Interval: {updateInterval ? updateInterval / 1000 : ""} s
        </ThemedText>
        <Slider
          style={{ width: "80%", height: 50 }}
          minimumValue={1000}
          maximumValue={30000}
          step={1000}
          value={value || 10000}
          onValueChange={handleUpdateIntervalChange}
          minimumTrackTintColor={Colors[colorScheme ?? "light"].text}
          maximumTrackTintColor={Colors[colorScheme ?? "light"].red}
          thumbTintColor={Colors[colorScheme ?? "light"].blue}
        />
      </View>
    </ScrollView>
  );
}
