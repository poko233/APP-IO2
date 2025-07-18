import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useCart } from "../components/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { createOrder, generateOrderNumber } from "../repositories/usuariosRepo";

// Importar los componentes
import EmptyCart from "../components/EmptyCart";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import PaymentMethod from "../components/PaymentMethod";
import QRModal from "../components/QRModal";
import TransactionModal from "../components/TransactionModal";
import ConfirmationDialog from "../components/ConfirmationDialog";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CartScreen() {
  const { items, totalPrice, removeFromCart, clearCart, addToCart, updateQuantity } = useCart();
  
  // Estados para modales y animaciones
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para confirmaciones
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showOrderSuccessConfirm, setShowOrderSuccessConfirm] = useState(false);
  const [showErrorConfirm, setShowErrorConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleIncreaseQuantity = (item) => {
    addToCart(item);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      setItemToDelete(item);
      setShowDeleteConfirm(true);
    }
  };

  const handleRemoveItem = (id) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setItemToDelete(item);
      setShowDeleteConfirm(true);
    }
  };

  const confirmRemoveItem = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleClearCart = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleQRPayment = () => {
    setShowQRModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePaymentConfirmed = () => {
    setShowQRModal(false);
    setTimeout(() => {
      setShowTransactionModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 300);
  };

  const saveOrderToDatabase = async () => {
    try {
      /*
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      */
      const orderNumber = generateOrderNumber();
      
      // Preparar los datos del pedido
      const orderData = {
        orderNumber,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          image: item.image || null,
        })),
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
        transactionId: paymentMethod === 'qr' ? transactionId : null,
        status: 'pendiente', // pendiente, procesando, completado, cancelado
        shippingAddress: null, // Puedes agregar dirección más tarde
        notes: '', // Notas adicionales
        itemsCount: items.length,
        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      };

      // Guardar en Firestore
      const savedOrder = await createOrder(orderData);
      
      return savedOrder;
    } catch (error) {
      console.error("Error al guardar pedido:", error);
      throw error;
    }
  };

  const handleCompleteOrder = async () => {
    if (paymentMethod === 'qr' && !transactionId.trim()) {
      setErrorMessage('Por favor, ingresa el ID de transacción para completar el pago.');
      setShowErrorConfirm(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Guardar el pedido en la base de datos
      const savedOrder = await saveOrderToDatabase();
      
      // Simular un pequeño delay para mostrar el procesamiento
      setTimeout(() => {
        setIsProcessing(false);
        setShowTransactionModal(false);
        setTransactionId('');
        setPaymentMethod('');
        
        // Guardar datos del pedido para mostrar en el diálogo de éxito
        setOrderData(savedOrder);
        setShowOrderSuccessConfirm(true);
        
        // Resetear animaciones
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1500);
      
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage('Error al procesar el pedido. Por favor, intenta nuevamente.');
      setShowErrorConfirm(true);
      console.error("Error al completar pedido:", error);
    }
  };

  const handleOrderSuccess = () => {
    setShowOrderSuccessConfirm(false);
    setOrderData(null);
    clearCart();
  };

  const closeModals = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowQRModal(false);
      setShowTransactionModal(false);
      setTransactionId('');
    });
  };

  // Si el carrito está vacío, mostrar componente vacío
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">Mi Carrito</Text>
            <TouchableOpacity 
              onPress={handleClearCart}
              className="bg-red-50 px-4 py-2 rounded-full"
            >
              <Text className="text-red-600 font-medium">Vaciar</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 mt-1">{items.length} productos</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              onRemove={handleRemoveItem}
            />
          ))}

          <OrderSummary totalPrice={totalPrice} />

          <PaymentMethod 
            paymentMethod={paymentMethod} 
            onPaymentMethodSelect={handlePaymentMethodSelect}
          />
        </ScrollView>

        <View className="bg-white px-6 py-4 shadow-lg">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              onPress={paymentMethod === 'qr' ? handleQRPayment : handleCompleteOrder}
              disabled={!paymentMethod || isProcessing}
              className={`py-4 rounded-2xl items-center ${
                paymentMethod && !isProcessing
                  ? 'bg-indigo-600' 
                  : 'bg-gray-300'
              }`}
            >
              {isProcessing ? (
                <View className="flex-row items-center">
                  <Ionicons name="hourglass-outline" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">Procesando...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">
                  {paymentMethod === 'qr' ? 'Generar QR' : 'Completar Pedido'}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <QRModal
        visible={showQRModal}
        onClose={closeModals}
        onPaymentConfirmed={handlePaymentConfirmed}
        totalPrice={totalPrice}
        slideAnim={slideAnim}
      />

      <TransactionModal
        visible={showTransactionModal}
        onClose={closeModals}
        onCompleteOrder={handleCompleteOrder}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        isProcessing={isProcessing}
        slideAnim={slideAnim}
      />

      {/* Diálogo de confirmación para eliminar producto */}
      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Eliminar producto"
        message={`¿Estás seguro de que quieres eliminar "${itemToDelete?.name}" del carrito?`}
        onConfirm={confirmRemoveItem}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Diálogo de confirmación para vaciar carrito */}
      <ConfirmationDialog
        visible={showClearConfirm}
        title="Vaciar carrito"
        message="¿Estás seguro de que quieres vaciar todo el carrito? Esta acción no se puede deshacer."
        onConfirm={confirmClearCart}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Vaciar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Diálogo de éxito del pedido */}
      <ConfirmationDialog
        visible={showOrderSuccessConfirm}
        title="¡Pedido Completado!"
        message={`Tu pedido #${orderData?.orderNumber} ha sido procesado exitosamente. Envianos un mensaje para confirmar tu pedido en el siguiente boton:`}
        onConfirm={handleOrderSuccess}
        onCancel={handleOrderSuccess}
        confirmText="Continuar"
        type="success"
        showCancelButton={false}
      />

      {/* Diálogo de error */}
      <ConfirmationDialog
        visible={showErrorConfirm}
        title="Error"
        message={errorMessage}
        onConfirm={() => setShowErrorConfirm(false)}
        onCancel={() => setShowErrorConfirm(false)}
        confirmText="Entendido"
        cancelText=""
        type="danger"
        showCancelButton={false}
      />
    </SafeAreaView>
  );
}