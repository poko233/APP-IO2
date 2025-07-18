// app/product/[id].js
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from "expo-router";
import { getProductById } from "../../repositories/usuariosRepo";
import { useCart } from "../../components/CartContext";
import "../../global.css";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID de producto no válido");
        setLoading(false);
        return;
      }

      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (e) {
        console.error("Error al cargar producto:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Cargando producto...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-red-500 text-center text-lg">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => {
            setError(null);
            setLoading(true);
            // Reintentar cargar
          }}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500 text-lg">Producto no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1">
        <Image
          source={{ uri: product.image }}
          className="w-full h-80"
          resizeMode="cover"
        />
        <View className="bg-white p-6 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {product.name}
          </Text>
          
          <Text className="text-3xl font-bold text-green-600 mb-4">
            Bs. {product.price}
          </Text>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Descripción
            </Text>
            <Text className="text-gray-600 leading-6">
              {product.description}
            </Text>
          </View>
          
          <TouchableOpacity className="bg-black rounded-lg py-4 mt-6">
            <Text className="text-white text-center font-semibold text-lg" onPress={() => addToCart(product)}>
              Agregar al carrito
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
