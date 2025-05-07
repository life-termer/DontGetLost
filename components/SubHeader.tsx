import { StyleSheet, useColorScheme, View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ScanControl } from "@/components/ScanControl";
import { BluetoothState } from "@/components/BluetoothState";
import { Colors } from "@/constants/Colors";

export default function SubHeader() {
  const colorScheme = useColorScheme();

  return (
      <ThemedView
        style={[
          {
            backgroundColor: Colors[colorScheme ?? "light"].backgroundLight,
          },
          styles.titleContainer,
        ]}
      >
        <BluetoothState />
        <ScanControl />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    position: "relative",
    zIndex: 10000,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    textAlign: "center",
    padding: 14,
    paddingBottom: 16,
    paddingTop: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  
});
