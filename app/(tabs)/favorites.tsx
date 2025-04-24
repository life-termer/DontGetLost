import { ScrollView, useColorScheme, View } from "react-native";
import SubHeader from "@/components/SubHeader";
import FavoriteDevicesList from "@/components/FavoriteDevicesList";
import { Colors } from "@/constants/Colors";

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        minHeight: "100%",
      }}
    >
      <SubHeader />
      <ScrollView>
        <FavoriteDevicesList tab={"favorites"} />
      </ScrollView>
    </View>
  );
}
