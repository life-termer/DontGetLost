import { ScrollView, useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import FavoriteDevicesList from "@/components/FavoriteDevicesList";
import { Colors } from "@/constants/Colors";
import { SortingButton } from "@/components/SortingButton2";
import FavoritesHeader from "@/components/FavoritesHeader";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <SubHeader tab="favorites" />
      <ScrollView>
        <FavoritesHeader />
        <FavoriteDevicesList tab={"favorites"} />
      </ScrollView>
    </View>
  );
}
