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
    border: gray300,
    blue: "#0284c7",
    blueAlpha: "rgba(2, 132, 199, 0.3)",
    red: "#9f1239",
    redAlpha2: "rgba(159, 18, 57, 0.2)",
    green: "#15803d",
    greenAlpha: "rgba(21, 128, 61, 0.3)",
    greenAlpha2: "rgba(21, 128, 61, 0.2)",
    yellow: "#f78f07",
    yellowAlpha: "rgba(247, 143, 7, 0.3)",
    tint: tintColorLight,
    icon: gray500,
    tabIconDefault: gray600,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: gray100,
    background: gray800,
    backgroundLight: gray700,
    border: gray600,
    blue: "#38bdf8",
    blueAlpha: "rgba(56, 189, 248, 0.3)",
    red: "#be123c",
    redAlpha2: "rgba(190, 18, 60, 0.2)",
    green: "#22c55e",
    greenAlpha: "rgba(34, 197, 94, 0.3)",
    greenAlpha2: "rgba(34, 197, 94, 0.2)",
    yellow: "#f78f07",
    yellowAlpha: "rgba(247, 143, 7, 0.3)",
    tint: tintColorDark,
    icon: gray300,
    tabIconDefault: gray500,
    tabIconSelected: tintColorDark,
  },
};
