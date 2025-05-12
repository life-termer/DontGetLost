import { StyleSheet, useColorScheme, View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ScanBtn } from "@/components/ScanBtn";
import { Colors } from "@/constants/Colors";
import SearchBtn from "./SearchBtn";
import { ClearBtn } from "./ClearBtn";
import DropdownComponent from "./SortingButton";
import SortingButton from "./SortingButton";

interface Props {
  tab: string;
}

export default function SubHeader({ tab }: Props) {
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
      <SearchBtn tab={tab} />
      <View style={styles.rowContainer}>
        <SortingButton />
        <ScanBtn />
        <ClearBtn />
      </View>
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
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
