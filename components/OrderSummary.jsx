// components/OrderSummary.js
import React from "react";
import { View, Text } from "react-native";

export default function OrderSummary({ totalPrice }) {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">Resumen del Pedido</Text>
      
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-600">Subtotal</Text>
        <Text className="text-gray-800 font-medium">Bs. {totalPrice.toFixed(2)}</Text>
      </View>
      
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-600">Envío</Text>
        <Text className="text-green-600 font-medium">Gratis</Text>
      </View>
      
      <View className="border-t border-gray-200 pt-3 mt-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Total</Text>
          <Text className="text-2xl font-bold text-indigo-600">
            Bs. {totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}