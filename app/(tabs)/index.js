import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../repositories/usuariosRepo"; // ajusta la ruta
import "../../global.css";

export default function HomeScreen() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProductos(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }
  return (
    <ScrollView className="bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Nuestros Productos
      </Text>

      <ProductCard products={productos} />

      <View className="h-20" />
    </ScrollView>
  );
}
