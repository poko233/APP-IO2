import { useFonts } from "expo-font";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { Stack, useRouter, useSegments } from "expo-router";
import { Pressable } from "react-native";
import { Logo } from "../components/Logo";
import { CartIcon } from "../components/Icons";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const current = segments[segments.length - 1];
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
    ...FontAwesome6.font,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
          marginBottom: 0,
          paddingBottom: 0,
          borderBottomWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
         headerShadowVisible: false,
        headerTitle: "",
        headerLeft: () => (
          <Pressable
            className="ml-4"
            onPress={() => {
              if (current !== "") {
                router.push("/");
              }
            }}
          >
            <Logo />
          </Pressable>
        ),

        headerRight: () => (
          <Pressable
            className="mr-4 z-10"
            onPress={() => {
              if (current !== "cart") {
                router.push("/cart");
              }
            }}
          >
            <CartIcon />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{ headerShown: true, headerTitle: "" }}
      />
    </Stack>
  );
}
