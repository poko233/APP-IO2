import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useCart } from "../components/CartContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const { items, totalPrice, removeFromCart, clearCart, addToCart, updateQuantity } = useCart();

  const handleIncreaseQuantity = (item) => {
    addToCart(item);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      Alert.alert(
        "Eliminar producto",
        "¿Estás seguro de que quieres eliminar este producto del carrito?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", onPress: () => removeFromCart(item.id) }
        ]
      );
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      "Vaciar carrito",
      "¿Estás seguro de que quieres vaciar todo el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vaciar", onPress: clearCart }
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      "Proceder al pago",
      `Total a pagar: Bs. ${totalPrice.toFixed(2)}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Pagar", onPress: () => {
          console.log("Procesando pago...");
        }}
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Ionicons name="cart-outline" size={80} color="#9CA3AF" />
        <Text className="text-xl text-gray-500 mt-4 text-center">
          Tu carrito está vacío
        </Text>
        <Text className="text-gray-400 mt-2 text-center">
          Agrega algunos productos para comenzar
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Tu Carrito</Text>

        {items.map(item => (
          <View
            key={item.id}
            className="flex-row bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200"
          >
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                className="w-full h-full"
                resizeMode="cover"
              />
           
            <View >
              <Text>
                {item.name}
              </Text>
              <Text >
                Bs. {item.price}
              </Text>

              <View>
                <View>
                  <Text>
                    {item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View >
          <View>
            <View >
              <Text>Total:</Text>
              <Text >
                Bs. {totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}