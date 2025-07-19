//app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { isAuthenticated, isLoading, userRole, hasRole } = useAuth();
  const insets = useSafeAreaInsets();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* Tab Home - Siempre visible */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="home" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Redes Sociales - Siempre visible */}
      <Tabs.Screen
        name="social"
        options={{
          title: 'Redes Sociales',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="instagram" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab Login - Solo visible si NO está autenticado */}
      <Tabs.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="sign-in" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
          href: isAuthenticated ? null : undefined,
        }}
      />

      {/* Tab Perfil - Solo visible si está autenticado */}
      <Tabs.Screen
        name="userInfo"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="user" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
          href: !isAuthenticated ? null : undefined,
        }}
      />

      {/* Tab Reportes - Solo visible para admin */}
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name="bar-chart" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
          // Solo visible si está autenticado Y es admin
          href: (isAuthenticated && hasRole('admin')) ? undefined : null,
        }}
      />
    </Tabs>
  );
}