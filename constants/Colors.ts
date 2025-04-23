/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { brand } from "expo-device";
import { green } from "react-native-reanimated/lib/typescript/Colors";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#d3d2d2",
    backgroundLight: "#f8f8f8",
    brand: "#0a7ea4",
    red: "#f4511e",
    green: "green",
    yellow: "#f78f07",
    gray: "#687076",
    grayLight: "#d3d2d2",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#11181C",
    background: "#d3d2d2",
    backgroundLight: "#f8f8f8",
    brand: "#0a7ea4",
    red: "#f4511e",
    green: "green",
    yellow: "#f78f07",
    gray: "#687076",
    grayLight: "#d3d2d2",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
};
