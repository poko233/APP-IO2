import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity, Pressable, ToastAndroid, Platform } from "react-native";
import { useCart } from "../components/CartContext";

const ProductCard = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Producto añadido al carrito', ToastAndroid.SHORT);
    } else {
      alert('Producto añadido al carrito');
    }
  };

  return (
    <View className="flex flex-row flex-wrap justify-center">
      {products.map((product) => (
        <View className="w-full max-w-xs m-2 bg-white rounded-lg shadow-md overflow-hidden" key={product.id}>
          <Link href={`/product/${product.id}`} asChild>
            <Pressable>
              <View className="w-full h-48 bg-gray-100">
                <Image
                  source={{
                    uri: product.image || "https://placehold.co/400x300",
                  }}
                  className="w-full h-full object-cover"
                  resizeMode="cover"
                />
              </View>
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-650">
                  {product.name}
                </Text>
                <Text className="mt-1 text-gray-800" numberOfLines={2}>
                  {product.description}
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-black">
                    Bs. {product.price}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
          <View className="w-full max-w-xs px-4 -mt-2 mb-4">
            <TouchableOpacity
              className="px-4 py-2 bg-black rounded-md"
              onPress={() => handleAddToCart(product)}
            >
              <Text className="text-white font-medium">Añadir al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProductCard;