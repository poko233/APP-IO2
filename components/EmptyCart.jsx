// components/EmptyCart.js
import React, { useRef, useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyCart() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-1 items-center justify-center p-6">
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="items-center"
        >
          <View className="bg-white rounded-full p-6 shadow-lg mb-6">
            <Ionicons name="cart-outline" size={80} color="#6366f1" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Tu carrito está vacío
          </Text>
          <Text className="text-gray-500 text-center text-lg">
            Agrega algunos productos para comenzar tu compra
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}