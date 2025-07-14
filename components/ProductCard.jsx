   import React from 'react';
   import { View, Text, Image, TouchableOpacity } from 'react-native';

   const ProductCard = ({ products }) => {
     return (
       <View className="flex flex-row flex-wrap justify-center">
         {products.map((product, index) => (
           <View 
             key={index} 
             className="w-full max-w-xs m-2 bg-white rounded-lg shadow-md overflow-hidden"
           >
             <View className="w-full h-48 bg-gray-100">
               <Image
                 source={{ uri: product.image || 'https://placehold.co/400x300' }}
                 className="w-full h-full object-cover"
                 alt={`Imagen del producto ${product.name}`}
                 resizeMode="cover"
               />
             </View>
             <View className="p-4">
               <Text className="text-lg font-semibold text-gray-800">
                 {product.name}
               </Text>
               <Text className="mt-1 text-gray-600" numberOfLines={2}>
                 {product.description}
               </Text>
               <View className="mt-3 flex-row items-center justify-between">
                 <Text className="text-lg font-bold text-indigo-600">
                   ${product.price}
                 </Text>
                 <TouchableOpacity 
                   className="px-4 py-2 bg-indigo-600 rounded-md"
                   onPress={() => console.log(`Añadiendo ${product.name} al carrito`)}
                 >
                   <Text className="text-white font-medium">
                     Añadir al carrito
                   </Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         ))}
       </View>
     );
   };

   export default ProductCard;
   