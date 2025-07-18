// components/TransactionModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal, Animated, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TransactionModal({ 
  visible, 
  onClose, 
  onCompleteOrder, 
  transactionId, 
  setTransactionId, 
  isProcessing, 
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
          className="bg-white rounded-3xl p-8 mx-6 shadow-2xl"
        >
          <TouchableOpacity 
            onPress={onClose}
            className="absolute top-4 right-4 p-2"
          >
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-gray-800 mb-2">Confirmar Pago</Text>
          <Text className="text-gray-600 mb-6 text-center">
            Ingresa el ID de transacción que aparece en tu app bancaria
          </Text>
          
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">ID de Transacción</Text>
            <TextInput
              value={transactionId}
              onChangeText={setTransactionId}
              placeholder="Ingresa el ID de transacción"
              className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg"
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity 
            onPress={onCompleteOrder}
            disabled={!transactionId.trim() || isProcessing}
            className={`py-4 rounded-2xl items-center ${
              transactionId.trim() && !isProcessing
                ? 'bg-indigo-600' 
                : 'bg-gray-300'
            }`}
          >
            <Text className="text-white font-bold text-lg">
              {isProcessing ? 'Procesando...' : 'Completar Pedido'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}