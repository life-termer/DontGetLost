import type { PropsWithChildren, ReactElement } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = PropsWithChildren<{}>;

export default function CustomScrollView({ children }: Props) {
  return <ScrollView>{children}</ScrollView>;
}
