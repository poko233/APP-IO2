import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const DetallePedido = () => {
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  useEffect(() => {
    cargarPedido();
  }, [id]);

  const cargarPedido = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPedido({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Pedido no encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar el pedido:', error);
      Alert.alert('Error', 'No se pudo cargar el pedido');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const timestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  const formatCurrency = (amount) => {
    return `Bs. ${(amount || 0).toFixed(2)}`;
  };

  const formatDateTime = (timestamp) => {
    const date = timestampToDate(timestamp);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const actualizarEstado = async (nuevoEstado) => {
    Alert.alert(
      'Confirmar cambio',
      `¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setActualizandoEstado(true);
              const docRef = doc(db, 'orders', id);
              await updateDoc(docRef, {
                status: nuevoEstado,
                updatedAt: new Date()
              });
              
              setPedido(prev => ({ ...prev, status: nuevoEstado }));
              Alert.alert('Éxito', 'Estado actualizado correctamente');
            } catch (error) {
              console.error('Error al actualizar estado:', error);
              Alert.alert('Error', 'No se pudo actualizar el estado');
            } finally {
              setActualizandoEstado(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
      case 'completed':
        return 'bg-green-100';
      case 'pendiente':
      case 'pending':
        return 'bg-yellow-100';
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completado':
      case 'completed':
        return 'text-green-800';
      case 'pendiente':
      case 'pending':
        return 'text-yellow-800';
      case 'cancelado':
      case 'cancelled':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const estados = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Cargando pedido...</Text>
      </SafeAreaView>
    );
  }

  if (!pedido) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600">Pedido no encontrado</Text>
      </SafeAreaView>
    );
  }

  const { date: fechaCreacion, time: horaCreacion } = formatDateTime(pedido.createdAt);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-9">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Feather name="arrow-left" size={24} color="#374151" />
            <Text className="ml-2 text-lg font-medium text-gray-700">Volver</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-900">
              Pedido #{pedido.orderNumber || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Estado y información básica */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">ID DEL PEDIDO</Text>
              <Text className="text-sm font-mono text-gray-700">{pedido.orderNumber}</Text>
            </View>
            <View className={`px-3 py-2 rounded-full ${getStatusColor(pedido.status)}`}>
              <Text className={`text-sm font-medium ${getStatusTextColor(pedido.status)}`}>
                {pedido.status || 'N/A'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-xs text-gray-500">FECHA</Text>
              <Text className="text-base font-medium text-gray-900">{fechaCreacion}</Text>
              <Text className="text-sm text-gray-600">{horaCreacion}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500">TOTAL</Text>
              <Text className="text-2xl font-bold text-green-600">
                {formatCurrency(pedido.totalAmount)}
              </Text>
            </View>
          </View>

          {/* Botones de cambio de estado */}
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-sm font-medium text-gray-700 mb-3">Cambiar estado:</Text>
            <View className="flex-row flex-wrap gap-2">
              {estados
                .filter(estado => estado.value !== pedido.status)
                .map(estado => (
                <TouchableOpacity
                  key={estado.value}
                  onPress={() => actualizarEstado(estado.value)}
                  disabled={actualizandoEstado}
                  className="px-4 py-2 bg-blue-600 rounded-lg"
                  activeOpacity={0.7}
                >
                  {actualizandoEstado ? (
                    <ActivityIndicator size={16} color="white" />
                  ) : (
                    <Text className="text-white text-sm font-medium">{estado.label}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Información del cliente */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Feather name="user" size={20} color="#2563eb" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Información del Cliente</Text>
          </View>
          
          <View className="space-y-3">
            <View>
              <Text className="text-xs text-gray-500 mb-1">NOMBRE</Text>
              <Text className="text-base text-gray-900">{pedido.userName || 'N/A'}</Text>
            </View>
            
            <View>
              <Text className="text-xs text-gray-500 mb-1">EMAIL</Text>
              <Text className="text-base text-gray-900">{pedido.userEmail || 'N/A'}</Text>
            </View>
            
            {pedido.userPhone && (
              <View>
                <Text className="text-xs text-gray-500 mb-1">TELÉFONO</Text>
                <Text className="text-base text-gray-900">{pedido.userPhone}</Text>
              </View>
            )}
            
            {pedido.shippingAddress && (
              <View>
                <Text className="text-xs text-gray-500 mb-1">DIRECCIÓN DE ENVÍO</Text>
                <Text className="text-base text-gray-900">{pedido.shippingAddress}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Detalles del pedido */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Feather name="package" size={20} color="#2563eb" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Detalles del Pedido</Text>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-xs text-gray-500 mb-1">CANTIDAD DE PRODUCTOS</Text>
              <Text className="text-base font-medium text-gray-900">
                {pedido.totalQuantity || 0} productos
              </Text>
            </View>
            
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">MÉTODO DE PAGO</Text>
              <Text className="text-base font-medium text-gray-900">
                {pedido.paymentMethod === 'physical' ? 'Efectivo' : 
                 pedido.paymentMethod === 'qr' ? 'QR' : 
                 pedido.paymentMethod || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Lista de productos */}
          {pedido.items && pedido.items.length > 0 && (
            <View className="border-t border-gray-200 pt-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">Productos:</Text>
              {pedido.items.map((item, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <View className="flex-1">
                    <Text className="text-base text-gray-900">{item.name || 'Producto'}</Text>
                    <Text className="text-sm text-gray-600">
                      Cantidad: {item.quantity || 0}
                    </Text>
                    {item.selectedSize && (
                      <Text className="text-sm text-gray-600">
                        Tamaño: {item.selectedSize}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-base font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {formatCurrency(item.price)} c/u
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Resumen financiero */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Feather name="dollar-sign" size={20} color="#2563eb" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Resumen Financiero</Text>
          </View>

          <View className="space-y-2">
            {pedido.items && pedido.items.length > 0 && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Subtotal:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatCurrency(pedido.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </Text>
              </View>
            )}

            {pedido.deliveryFee > 0 && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Costo de envío:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatCurrency(pedido.deliveryFee)}
                </Text>
              </View>
            )}

            <View className="border-t border-gray-200 pt-2 mt-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900">Total:</Text>
                <Text className="text-lg font-bold text-green-600">
                  {formatCurrency(pedido.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetallePedido;