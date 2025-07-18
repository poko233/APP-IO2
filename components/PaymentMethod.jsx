// components/PaymentMethod.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentMethod({ paymentMethod, onPaymentMethodSelect }) {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">Método de Pago</Text>
      
      <TouchableOpacity 
        onPress={() => onPaymentMethodSelect('physical')}
        className={`flex-row items-center p-4 rounded-xl border-2 mb-3 ${
          paymentMethod === 'physical' 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
          paymentMethod === 'physical' 
            ? 'border-indigo-500 bg-indigo-500' 
            : 'border-gray-300'
        }`}>
          {paymentMethod === 'physical' && (
            <View className="w-full h-full rounded-full bg-white scale-50" />
          )}
        </View>
        <Ionicons name="cash-outline" size={24} color="#6366f1" />
        <Text className="ml-3 text-gray-800 font-medium">Pago contra entrega</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => onPaymentMethodSelect('qr')}
        className={`flex-row items-center p-4 rounded-xl border-2 ${
          paymentMethod === 'qr' 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
          paymentMethod === 'qr' 
            ? 'border-indigo-500 bg-indigo-500' 
            : 'border-gray-300'
        }`}>
          {paymentMethod === 'qr' && (
            <View className="w-full h-full rounded-full bg-white scale-50" />
          )}
        </View>
        <Ionicons name="qr-code-outline" size={24} color="#6366f1" />
        <Text className="ml-3 text-gray-800 font-medium">QR Bancario</Text>
      </TouchableOpacity>
    </View>
  );
}