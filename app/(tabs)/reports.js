import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  Dimensions,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../../config/firebaseConfig";

const { height: screenHeight } = Dimensions.get("window");

const ReportesPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroMes, setFiltroMes] = useState("todos");
  const [busquedaId, setBusquedaId] = useState("");
  const [pedidosEncontrados, setPedidosEncontrados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Detectar cuando aparece/desaparece el teclado y su altura
  useEffect(() => {
    const keyboardDidShowListener =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardDidHideListener =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      keyboardDidShowListener,
      (event) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const hideSubscription = Keyboard.addListener(
      keyboardDidHideListener,
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  // Cargar pedidos desde Firebase
  useEffect(() => {
    const pedidosRef = collection(db, "orders");
    const q = query(pedidosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const pedidosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPedidos(pedidosData);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar pedidos:", error);
        Alert.alert("Error", "No se pudieron cargar los pedidos");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Función para convertir timestamp a fecha
  const timestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  // Filtrar pedidos por mes
  const pedidosFiltrados = useMemo(() => {
    if (filtroMes === "todos") return pedidos;

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();

    return pedidos.filter((pedido) => {
      const fechaPedido = timestampToDate(pedido.createdAt);
      if (filtroMes === "actual") {
        return (
          fechaPedido.getMonth() === mesActual &&
          fechaPedido.getFullYear() === añoActual
        );
      } else {
        const mesSeleccionado = parseInt(filtroMes);
        return (
          fechaPedido.getMonth() === mesSeleccionado &&
          fechaPedido.getFullYear() === añoActual
        );
      }
    });
  }, [pedidos, filtroMes]);

  // Cálculos financieros
  const estadisticasFinancieras = useMemo(() => {
    const totalVentas = pedidosFiltrados.reduce(
      (sum, pedido) => sum + (pedido.totalAmount || 0),
      0
    );
    const totalPedidos = pedidosFiltrados.length;
    const totalProductos = pedidosFiltrados.reduce(
      (sum, pedido) => sum + (pedido.totalQuantity || 0),
      0
    );
    const promedioVenta = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

    const pedidosPorEstado = {};
    pedidosFiltrados.forEach((pedido) => {
      const status = pedido.status || "sin estado";
      pedidosPorEstado[status] = (pedidosPorEstado[status] || 0) + 1;
    });

    const ventasPorMetodoPago = {};
    pedidosFiltrados.forEach((pedido) => {
      const metodo = pedido.paymentMethod || "no especificado";
      ventasPorMetodoPago[metodo] =
        (ventasPorMetodoPago[metodo] || 0) + (pedido.totalAmount || 0);
    });

    const clientesUnicos = new Set(
      pedidosFiltrados.map((p) => p.userEmail).filter(Boolean)
    ).size;

    return {
      totalVentas,
      totalPedidos,
      totalProductos,
      promedioVenta,
      pedidosPorEstado,
      ventasPorMetodoPago,
      clientesUnicos,
    };
  }, [pedidosFiltrados]);

  // Buscar pedidos por ID o número de orden
  const buscarPedidos = async (terminoBusqueda) => {
    setBuscando(true);

    try {
      const termino = terminoBusqueda.toLowerCase().trim();

      if (!termino) {
        setPedidosEncontrados([]);
        setBuscando(false);
        return;
      }

      const resultados = pedidos.filter((pedido) => {
        const id = pedido.id?.toLowerCase() || "";
        const orderNumber = pedido.orderNumber?.toString().toLowerCase() || "";
        const userName = pedido.userName?.toLowerCase() || "";
        const userEmail = pedido.userEmail?.toLowerCase() || "";

        return (
          id.includes(termino) ||
          orderNumber.includes(termino) ||
          userName.includes(termino) ||
          userEmail.includes(termino)
        );
      });

      setPedidosEncontrados(resultados);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      Alert.alert("Error", "Error al realizar la búsqueda");
    }

    setBuscando(false);
  };

  // Manejar cambio en el campo de búsqueda
  const handleBusquedaChange = (texto) => {
    setBusquedaId(texto);

    // Búsqueda en tiempo real con debounce
    if (texto.trim()) {
      const timeoutId = setTimeout(() => {
        buscarPedidos(texto);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setPedidosEncontrados([]);
    }
  };

  const handleBusquedaSubmit = () => {
    buscarPedidos(busquedaId);
  };

  // Función mejorada para hacer scroll al input cuando se enfoque - SOLUCIÓN DEFINITIVA
  const handleInputFocus = () => {
    // Pequeño delay para que el teclado aparezca primero
    setTimeout(
      () => {
        if (searchContainerRef.current && scrollViewRef.current) {
          searchContainerRef.current.measureInWindow((x, y, width, height) => {
            // Calcular la posición objetivo
            const keyboardBuffer =
              Platform.OS === "android" ? keyboardHeight + 20 : 100;
            const targetY = Math.max(0, y - keyboardBuffer);

            // Hacer scroll suave a la posición calculada
            scrollViewRef.current.scrollTo({
              x: 0,
              y: targetY,
              animated: true,
            });
          });
        }
      },
      Platform.OS === "android" ? 200 : 300
    );
  };

  // Navegar al detalle del pedido
  const verDetallePedido = (pedido) => {
    router.push(`/pedidos/${pedido.id}`);
  };

  const formatCurrency = (amount) => {
    return `Bs. ${(amount || 0).toFixed(2)}`;
  };

  const meses = [
    { value: "todos", label: "Todos los pedidos" },
    { value: "actual", label: "Mes actual" },
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completado":
      case "completed":
        return "bg-green-100";
      case "pendiente":
      case "pending":
        return "bg-yellow-100";
      case "cancelado":
      case "cancelled":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "completado":
      case "completed":
        return "text-green-800";
      case "pendiente":
      case "pending":
        return "text-yellow-800";
      case "cancelado":
      case "cancelled":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  const renderMesItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setFiltroMes(item.value);
        setMostrarDropdown(false);
      }}
      className="px-4 py-3 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <Text
        className={`text-base ${filtroMes === item.value ? "text-blue-600 font-medium" : "text-gray-700"}`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Cargando reportes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingTop: 16,
            // Padding bottom más grande cuando hay teclado visible
            paddingBottom: isKeyboardVisible ? keyboardHeight + 150 : 100,
            flexGrow: 1,
          }}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Dashboard de Reportes
            </Text>
            <Text className="text-gray-600">
              Análisis financiero y gestión de pedidos
            </Text>
          </View>

          {/* Selector de período */}
          <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={20} color="#2563eb" />
              <Text className="text-sm font-medium text-gray-700 ml-2">
                Período de reporte:
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setMostrarDropdown(true)}
              className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 text-base">
                {meses.find((m) => m.value === filtroMes)?.label}
              </Text>
              <Feather name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Modal para selector de meses */}
          <Modal
            visible={mostrarDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMostrarDropdown(false)}
          >
            <View
              className="flex-1 justify-center items-center"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <View className="bg-white rounded-lg mx-4 max-w-sm w-full max-h-96 overflow-hidden">
                <View className="p-4 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900">
                    Seleccionar período
                  </Text>
                </View>

                <FlatList
                  data={meses}
                  renderItem={renderMesItem}
                  keyExtractor={(item) => item.value}
                  showsVerticalScrollIndicator={true}
                  style={{ maxHeight: 300 }}
                />

                <TouchableOpacity
                  onPress={() => setMostrarDropdown(false)}
                  className="p-4 border-t border-gray-200"
                  activeOpacity={0.7}
                >
                  <Text className="text-center text-gray-600 font-medium">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Estadísticas financieras principales */}
          <View className="flex-row flex-wrap justify-between mb-6">
            <View className="bg-white p-4 rounded-lg shadow-sm w-[48%] mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600">Ventas Totales</Text>
                  <Text className="text-xl font-bold text-green-600">
                    {formatCurrency(estadisticasFinancieras.totalVentas)}
                  </Text>
                </View>
                <Feather name="dollar-sign" size={24} color="#16a34a" />
              </View>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-sm w-[48%] mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600">Total Pedidos</Text>
                  <Text className="text-xl font-bold text-blue-600">
                    {estadisticasFinancieras.totalPedidos}
                  </Text>
                </View>
                <Feather name="package" size={24} color="#2563eb" />
              </View>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-sm w-[48%] mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600">
                    Promedio por Venta
                  </Text>
                  <Text className="text-xl font-bold text-purple-600">
                    {formatCurrency(estadisticasFinancieras.promedioVenta)}
                  </Text>
                </View>
                <Feather name="trending-up" size={24} color="#9333ea" />
              </View>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-sm w-[48%] mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600">Clientes Únicos</Text>
                  <Text className="text-xl font-bold text-orange-600">
                    {estadisticasFinancieras.clientesUnicos}
                  </Text>
                </View>
                <Feather name="users" size={24} color="#ea580c" />
              </View>
            </View>
          </View>

          {/* Análisis detallado */}
          <View className="mb-6">
            {/* Pedidos por estado */}
            <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <Text className="text-lg font-semibold mb-3">
                Pedidos por Estado
              </Text>
              {Object.entries(estadisticasFinancieras.pedidosPorEstado).map(
                ([estado, cantidad]) => (
                  <View
                    key={estado}
                    className="flex-row justify-between items-center mb-2"
                  >
                    <Text className="capitalize text-gray-700">{estado}</Text>
                    <Text className="font-semibold text-gray-900">
                      {cantidad}
                    </Text>
                  </View>
                )
              )}
            </View>

            {/* Ventas por método de pago */}
            <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <Text className="text-lg font-semibold mb-3">
                Ventas por Método de Pago
              </Text>
              {Object.entries(estadisticasFinancieras.ventasPorMetodoPago).map(
                ([metodo, total]) => (
                  <View
                    key={metodo}
                    className="flex-row justify-between items-center mb-2"
                  >
                    <Text className="capitalize text-gray-700">
                      {metodo === "physical"
                        ? "Efectivo"
                        : metodo === "qr"
                          ? "QR"
                          : metodo}
                    </Text>
                    <Text className="font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
          {/* Buscador de pedidos - CONTENEDOR CON REF PARA SCROLL */}
          <View
            ref={searchContainerRef}
            className="bg-white rounded-lg shadow-sm p-4 mb-6"
          >
            <Text className="text-xl font-semibold mb-4">Buscar Pedido</Text>

            {/* Campo de búsqueda */}
            <KeyboardAvoidingView>
              <SafeAreaView>
                <View className="flex-row gap-2 mb-4">
                  <View className="flex-1 relative">
                    <TextInput
                      ref={searchInputRef}
                      value={busquedaId}
                      onChangeText={handleBusquedaChange}
                      onFocus={handleInputFocus}
                      placeholder="ID, número de orden, cliente o email..."
                      className="flex-1 pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base bg-white"
                      onSubmitEditing={handleBusquedaSubmit}
                      returnKeyType="search"
                      autoCapitalize="none"
                      autoCorrect={false}
                      blurOnSubmit={false}
                    />
                    <View className="absolute left-3 top-3.5">
                      {buscando ? (
                        <ActivityIndicator size={16} color="#9ca3af" />
                      ) : (
                        <Feather name="search" size={16} color="#9ca3af" />
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleBusquedaSubmit}
                    className="px-6 py-3 bg-blue-600 rounded-lg justify-center"
                    activeOpacity={0.7}
                    disabled={buscando}
                  >
                    <Text className="text-white font-medium">Buscar</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
            {/* Resultados de búsqueda */}
            {pedidosEncontrados.length > 0 && (
              <View>
                <Text className="text-sm text-gray-600 mb-3">
                  {pedidosEncontrados.length} resultado
                  {pedidosEncontrados.length !== 1 ? "s" : ""} encontrado
                  {pedidosEncontrados.length !== 1 ? "s" : ""}:
                </Text>

                {pedidosEncontrados.map((pedido) => (
                  <TouchableOpacity
                    key={pedido.id}
                    onPress={() => verDetallePedido(pedido)}
                    className="border border-gray-200 rounded-lg p-4 mb-3 bg-white"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="font-semibold text-lg text-gray-900">
                          Pedido #{pedido.orderNumber || "N/A"}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          ID: {pedido.id}
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${getStatusColor(pedido.status)}`}
                      >
                        <Text
                          className={`text-xs font-medium ${getStatusTextColor(pedido.status)}`}
                        >
                          {pedido.status || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-1">
                        <Text className="text-sm text-gray-600">Cliente</Text>
                        <Text className="font-medium text-gray-900">
                          {pedido.userName || "N/A"}
                        </Text>
                      </View>
                      <View className="flex-1 items-end">
                        <Text className="text-sm text-gray-600">Total</Text>
                        <Text className="font-bold text-lg text-green-600">
                          {formatCurrency(pedido.totalAmount)}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-sm text-gray-600">Fecha</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {timestampToDate(pedido.createdAt).toLocaleDateString(
                            "es-ES"
                          )}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Feather
                          name="chevron-right"
                          size={16}
                          color="#9ca3af"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {busquedaId.trim() &&
              pedidosEncontrados.length === 0 &&
              !buscando && (
                <View className="text-center py-4">
                  <Text className="text-gray-500">
                    No se encontraron pedidos
                  </Text>
                </View>
              )}
          </View>

          {/* Espacio adicional dinámico basado en el estado del teclado */}
          <View
            style={{ height: isKeyboardVisible ? keyboardHeight + 50 : 50 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReportesPedidos;
