import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";

const ProductCard = ({ products }) => {
  return (
    <View className="flex flex-row flex-wrap justify-center">
      {products.map((product) => (
        <View className="w-full max-w-xs m-2 bg-white rounded-lg shadow-md overflow-hidden" key={product.id}>
          <Link  href={`/product/${product.id}`} asChild>
            <Pressable >
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
                    ${product.price}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
          <View className="w-full max-w-xs px-4 -mt-2 mb-4">
            <TouchableOpacity
              className="px-4 py-2 bg-black rounded-md"
              onPress={() =>
                <Text>console.log(`Añadiendo ${product.name} al carrito`)</Text>
              }
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
