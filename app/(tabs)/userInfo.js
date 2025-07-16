import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function UserInfoScreen() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        // si no hay sesión activa, redirige al login
        router.replace("/login");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No se encontró el usuario");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Información del Usuario</Text>
      <Text>Nombre: {userData?.nombre}</Text>
      <Text>Correo: {userData?.correo}</Text>
      <Text>Teléfono: {userData?.telefono}</Text>
      <Text>Dirección: {userData?.direccion}</Text>

      {/* Aquí podrías agregar botón para editar o cerrar sesión */}
      <Button title="Editar Datos" onPress={() => router.push("/editarPerfil")} />
      <Button title="Cerrar Sesión" onPress={async () => {
        await auth.signOut();
        router.replace("/login");
      }} />
    </View>
  );
}
