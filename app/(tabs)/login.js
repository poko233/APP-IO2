import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { loginUser, getUserData } from "../../repositories/usuariosRepo";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../config/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
    console.log("Intentando iniciar sesión...");
      const user = await loginUser(email, password);
      console.log("Usuario logueado:", user);

      const userData = await getUserData(user.uid);
      console.log("Datos del usuario:", userData);

      //mensaje de éxito antes de redirigir
      Alert.alert(
        "¡Bienvenido!",
        "Inicio de sesión exitoso",
        [
          {
            text: "OK",
            onPress: () => {
              if (userData.rol === "vendedor") {
                navigation.navigate("ReportScreen");
              } else {
                navigation.navigate("ProductsScreen");
              }
            }
          }
        ]
      );


  } catch (error) {
    console.log("Error en login:", error);
    Alert.alert("Error", error.message);
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.linkText}>¿No tienes cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:28, marginBottom:20, textAlign:"center", fontWeight:"bold" },
  input: { borderWidth:1, borderColor:"#ccc", padding:10, borderRadius:8, marginBottom:15 },
  button: { backgroundColor:"#007AFF", padding:15, borderRadius:8 },
  buttonText: { color:"#fff", textAlign:"center", fontWeight:"bold" },
  linkText: { color:"#007AFF", textAlign:"center", marginTop:10 }
});
