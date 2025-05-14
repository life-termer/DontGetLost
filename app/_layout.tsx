import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import "react-native-reanimated";
import GlobalProvider, { GlobalContext } from "@/context/GlobalContext";

import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import * as ScreenOrientation from 'expo-screen-orientation';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    MontserratLight: require("../assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    OpenSans: require("../assets/fonts/Open_Sans/OpenSans-Regular.ttf"),
    OpenSansLight: require("../assets/fonts/Open_Sans/OpenSans-Light.ttf"),
    OpenSansSemiBold: require("../assets/fonts/Open_Sans/OpenSans-SemiBold.ttf"),
    OpenSansBold: require("../assets/fonts/Open_Sans/OpenSans-Bold.ttf"),
  });

  const { isScanning, setIsScanning } = useContext(GlobalContext);
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // useEffect(() => {
  //   async function changeScreenOrientation() {
  //     await ScreenOrientation.unlockAsync(); // Enable all orientations
  //     // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // Lock to landscape
  //     // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait
  //   }

  //   changeScreenOrientation();

  //   return () => {
  //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait on unmount
  //   };
  // }, []);

  return (
    <GestureHandlerRootView>
      <GlobalProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
