// components/CartItem.js
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onRemove(item.id);
    });
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      <View className="flex-row">
        <View className="w-20 h-20 bg-gray-100 rounded-xl mr-4">
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/80' }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.name}
          </Text>
          <Text className="text-xl font-bold text-indigo-600 mb-3">
            Bs. {item.price}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-gray-100 rounded-full px-1 py-1">
              <TouchableOpacity 
                onPress={() => onDecrease(item)}
                className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
              >
                <Ionicons name="remove" size={16} color="#6366f1" />
              </TouchableOpacity>
              
              <Text className="mx-4 text-lg font-semibold text-gray-800 min-w-8 text-center">
                {item.quantity}
              </Text>
              
              <TouchableOpacity 
                onPress={() => onIncrease(item)}
                className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
              >
                <Ionicons name="add" size={16} color="#6366f1" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={handleRemove}
              className="p-2"
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}