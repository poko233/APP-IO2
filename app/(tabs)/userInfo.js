import React from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function UserInfoScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 24 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#f3f4f6',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <FontAwesome name="user" size={40} color="#6b7280" />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
            Mi Perfil
          </Text>
        </View>

        {/* User Info */}
        {user && (
          <View style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 30 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <FontAwesome name="envelope" size={16} color="#6b7280" />
              <Text style={{ 
                fontSize: 16, 
                marginLeft: 12, 
                color: '#374151',
                fontWeight: '500' 
              }}>
                {user.email}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="id-card" size={16} color="#6b7280" />
              <Text style={{ 
                fontSize: 14, 
                marginLeft: 12, 
                color: '#6b7280',
                fontFamily: 'monospace' 
              }}>
                ID: {user.uid?.substring(0, 8)}...
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={{ gap: 16 }}>
          {/* Settings Option */}
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9fafb',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb'
            }}
            onPress={() => {
              // Aquí puedes navegar a configuraciones
              Alert.alert('Configuración', 'Función próximamente disponible');
            }}
          >
            <FontAwesome name="cog" size={20} color="#374151" />
            <Text style={{ 
              fontSize: 16, 
              marginLeft: 12, 
              color: '#374151',
              fontWeight: '500' 
            }}>
              Configuración
            </Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color="#9ca3af" 
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {/* Help Option */}
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9fafb',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb'
            }}
            onPress={() => {
              Alert.alert('Ayuda', 'Función próximamente disponible');
            }}
          >
            <FontAwesome name="question-circle" size={20} color="#374151" />
            <Text style={{ 
              fontSize: 16, 
              marginLeft: 12, 
              color: '#374151',
              fontWeight: '500' 
            }}>
              Ayuda y soporte
            </Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color="#9ca3af" 
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="sign-out" size={18} color="#fff" />
            <Text style={{ 
              color: '#fff', 
              fontSize: 16, 
              fontWeight: '600',
              marginLeft: 8 
            }}>
              Cerrar Sesión
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}