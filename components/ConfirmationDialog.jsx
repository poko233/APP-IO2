// components/ConfirmationDialog.js
import React from "react";
import { View, Text, TouchableOpacity, Modal, Linking  } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmationDialog({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning", // warning, danger, success
  showCancelButton = true,
  confirmAction = null
}) {
  const getIconColor = () => {
    switch (type) {
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return '#f59e0b';
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'danger': return 'trash-outline';
      case 'success': return 'checkmark-circle-outline';
      default: return 'warning-outline';
    }
  };
  const handleConfirm = async () => {
    if (typeof confirmAction === 'string') {
      // Si es una URL, abrir en el navegador
      try {
        const canOpen = await Linking.canOpenURL(confirmAction);
        if (canOpen) {
          await Linking.openURL(confirmAction);
        }
      } catch (error) {
        console.error('Error al abrir URL:', error);
      }
    }
    
    // Ejecutar onConfirm si existe
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <View className="items-center mb-6">
            <View className="bg-gray-100 rounded-full p-4 mb-4">
              <Ionicons name={getIconName()} size={32} color={getIconColor()} />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
              {title}
            </Text>
            <Text className="text-gray-600 text-center">
              {message}
            </Text>
          </View>

          <View className={`flex-row ${showCancelButton ? 'space-x-3' : ''}`}>
            {showCancelButton && (
              <TouchableOpacity 
                onPress={onCancel}
                className="flex-1 bg-gray-100 py-3 rounded-2xl items-center"
              >
                <Text className="text-gray-700 font-semibold text-lg">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleConfirm}
              className={`py-3 rounded-2xl items-center ${
                showCancelButton ? 'flex-1' : 'flex-1'
              } ${type === 'danger' ? 'bg-red-600' : 'bg-indigo-600'}`}
            >
              <Text className="text-white font-semibold text-lg">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}