import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from 'react-native-screens';
enableScreens();

// Importa tus pantallas
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import ReportScreen from "./src/screens/ReportScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="ProductsScreen"
          component={ProductsScreen}
          options={{ title: "Productos" }}
        />
        <Stack.Screen
          name="ReportScreen"
          component={ReportScreen}
          options={{ title: "Reporte de Ventas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}