// components/QRModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal, Animated,Image  } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QRModal({ 
  visible, 
  onClose, 
  onPaymentConfirmed, 
  totalPrice, 
  slideAnim 
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-3xl p-8 mx-6 items-center shadow-2xl"
        >
          <TouchableOpacity 
            onPress={onClose}
            className="absolute top-4 right-4 p-2"
          >
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-gray-800 mb-2">Escanea el QR</Text>
          <Text className="text-gray-600 mb-6 text-center">
            Escanea este código QR con tu app bancaria
          </Text>
          
          <View className="bg-white p-1 rounded-2xl mb-6 border border-gray-200">
            <Image
              source={require('../assets/qr.png')} // Ruta a tu imagen QR
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
          
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Total a pagar: Bs. {totalPrice.toFixed(2)}
          </Text>
          
          <TouchableOpacity 
            onPress={onPaymentConfirmed}
            className="bg-green-600 px-8 py-3 rounded-2xl mt-4"
          >
            <Text className="text-white font-bold text-lg">Ya Pagué</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}