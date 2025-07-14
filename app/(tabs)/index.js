import { View, Text , ScrollView} from 'react-native';
import ProductCard from '../../components/ProductCard';
import '../../global.css';
const productos = [
    {
      id: 3,
      name: 'Presentacion 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 199.99,
      image: 'https://www.conasi.eu/blog/wp-content/uploads/2022/07/l%C3%A1minas-de-fruta-deshidratada-d.jpg'
    },
    {
      id: 4,
      name: 'Presentacion 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 1299.99,
      image: 'https://www.conasi.eu/blog/wp-content/uploads/2022/07/l%C3%A1minas-de-fruta-deshidratada-1.jpg'
    },
    {
      id: 5,
      name: 'Presentacion 3',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 249.99,
      image: 'https://mercaditodigital.com.bo/wp-content/uploads/2023/09/laminas.jpg'
    },
    {
      id: 6,
      name: 'Presentacion 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 1799.99,
      image: 'https://i.ytimg.com/vi/fzMKpdxMpBg/sddefault.jpg'
    }
]
export default function HomeScreen() {
  return (
    
      <ScrollView className="bg-gray-50 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Nuestros Productos</Text>
        
        {/* Pasamos el array de productos al componente ProductCard */}
        <ProductCard products={productos} />
        
        <View className="h-20"></View> {/* Espacio adicional al final */}
      </ScrollView>
    
  );
}
