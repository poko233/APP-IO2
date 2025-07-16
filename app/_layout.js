import { useFonts } from "expo-font";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { CartProvider, useCart } from "../components/CartContext";

import { Stack, useRouter, useSegments } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { Logo } from "../components/Logo";
import { CartIcon } from "../components/Icons";

function LayoutContent() {
  const { totalCount } = useCart(); 
  const router = useRouter();
  const segments = useSegments();
  const current = segments[segments.length - 1];

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
          height: 90,
        },
        headerShadowVisible: false,
        headerTitle: "",
        headerRightContainerStyle: {
          paddingRight: 10,
          paddingTop: 5,
        },
        headerLeftContainerStyle: {
          paddingLeft: 10,
        },

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
            className="z-10"
            onPress={() => {
              if (current !== "cart") {
                router.push("/cart");
              }
            }}
            style={{ padding: 8 }}
          >
            <View className="relative">
              <CartIcon />
              {totalCount > 0 && (
                <View
                  className="absolute bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                  style={{ top: -8, right: -8 }}
                >
                  <Text className="text-white text-xs font-bold">
                    {totalCount > 99 ? "99+" : totalCount}
                  </Text>
                </View>
              )}
            </View>
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
export default function Layout() {
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
    ...FontAwesome6.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CartProvider>
      <LayoutContent />
    </CartProvider>
  );
}
