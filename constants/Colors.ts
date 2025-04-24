/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { brand } from "expo-device";
import { green } from "react-native-reanimated/lib/typescript/Colors";

const gray50 = "#f9fafb";
const gray100 = "#f3f4f6";
const gray200 = "#e5e7eb";
const gray300 = "#d1d5db";
const gray400 = "#9ca3af";
const gray500 = "#6b7280";
const gray600 = "#4b5563";
const gray700 = "#374151";
const gray800 = "#1f2937";
const gray900 = "#111827";
const gray950 = "#030712";
const tintColorLight = "#075985";
const tintColorDark = "#0ea5e9";

export const Colors = {
  light: {
    text: gray800,
    background: gray200,
    backgroundLight: gray100,
    blue: "#0284c7",
    red: "#9f1239",
    green: "#15803d",
    yellow: "#f78f07",
    tint: tintColorLight,
    icon: gray500,
    tabIconDefault: gray600,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: gray100,
    background: gray800,
    backgroundLight: gray700,
    blue: "#38bdf8",
    red: "#be123c",
    green: "#22c55e",
    yellow: "#f78f07",
    tint: tintColorDark,
    icon: gray300,
    tabIconDefault: gray500,
    tabIconSelected: tintColorDark,
  },
};
