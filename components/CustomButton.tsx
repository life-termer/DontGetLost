import { Text, type TextProps, StyleSheet, TouchableHighlight, Pressable } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'primary' | 'secondary';
};

export function CustomButton({
  style,
  lightColor,
  darkColor,
  type = 'primary',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Pressable 
                style={({ pressed }: { pressed: boolean }) =>
                  [styles.buttonWrapper, pressed && styles.buttonPressed]
                }
                onPress={() => console.log("button pressed")}
              >
                <ThemedText style={styles.buttonPrimary}>Press me</ThemedText>
              </Pressable>
    // <TouchableHighlight>
    // <Text
    //   style={[
    //     { color },
    //     type === 'primary' ? styles.primary : undefined,
    //     type === 'secondary' ? styles.secondary : undefined,
    //     style,
    //   ]}
    //   {...rest}
    // />
    // </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  primary: {
    fontFamily: 'OpenSans',
    backgroundColor: '#000000',
    fontSize: 16,
    lineHeight: 24,
  },
  secondary: {
    fontFamily: 'OpenSans',
    backgroundColor: '#000000',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonWrapper: {
    width: 100,
    height: 40,
    display: "flex",
    justifyContent: "center",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    backgroundColor: "#be4e4e",
  },
  buttonPressed: {
    backgroundColor: "#aa4646",
    color: "#b3b3b3",
  },
  buttonPrimary: {
    fontFamily: "OpenSans",
    color: "#ffffff",
  },
});
