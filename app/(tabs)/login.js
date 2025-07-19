// app/login.js
import React, { useState, useCallback, useRef } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Usar el contexto de autenticación
  const { login } = useAuth();
  
  // Referencias para los inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Función memoizada para manejar el login
  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      // Usar la función login del contexto (que maneja Firebase + getUserData)
      await login({
        email: email.trim(),
        password: password
      });

      // El contexto maneja automáticamente:
      // 1. Firebase Auth
      // 2. Obtener datos del usuario (incluyendo rol)
      // 3. Setear isAuthenticated = true
      // 4. El _layout.js detectará el cambio y mostrará/ocultará las tabs correctamente
      
      Alert.alert("¡Bienvenido!", "Inicio de sesión exitoso", [
        {
          text: "OK",
          onPress: () => {
            // Navegar a Home - el layout se encargará de mostrar las tabs correctas
            router.replace("/");
          },
        },
      ]);

    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error", error?.message || "Error desconocido al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  // Handlers optimizados para los inputs
  const handleEmailChange = useCallback((text) => {
    setEmail(text);
  }, []);

  const handlePasswordChange = useCallback((text) => {
    setPassword(text);
  }, []);

  const handleRegisterPress = useCallback(() => {
    try {
      router.push("/register");
    } catch (error) {
      console.error("Error navegando a registro:", error);
    }
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 20 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              flexGrow: 1, 
              justifyContent: 'center', 
              paddingHorizontal: 24, 
              paddingVertical: 32,
              minHeight: '100%'
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ marginBottom: 48 }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 }}>
                Bienvenido
              </Text>
              <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
                Inicia sesión en tu cuenta
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: 20 }}>
              {/* Email Input */}
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Correo electrónico
                </Text>
                <TextInput
                  ref={emailRef}
                  style={{
                    height: 56,
                    backgroundColor: '#F9FAFB',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    fontSize: 16,
                    color: '#111827'
                  }}
                  placeholder="tu@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  returnKeyType="next"
                  value={email}
                  onChangeText={handleEmailChange}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  editable={!isLoading}
                  textContentType="emailAddress"
                  inputMode="email"
                />
              </View>

              {/* Password Input */}
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Contraseña
                </Text>
                <TextInput
                  ref={passwordRef}
                  style={{
                    height: 56,
                    backgroundColor: '#F9FAFB',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    fontSize: 16,
                    color: '#111827'
                  }}
                  placeholder="Tu contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  returnKeyType="done"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                  textContentType="password"
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={{
                  height: 56,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 32,
                  backgroundColor: isLoading ? '#60A5FA' : '#2563EB',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
                      Iniciando sesión...
                    </Text>
                  </View>
                ) : (
                  <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>
                    Iniciar Sesión
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <TouchableOpacity
              onPress={handleRegisterPress}
              style={{ marginTop: 32, alignItems: 'center', paddingVertical: 12 }}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={{ color: '#2563EB', fontSize: 16 }}>
                ¿No tienes cuenta?{" "}
                <Text style={{ fontWeight: '600' }}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>

            {/* Spacer for better keyboard handling */}
            <View style={{ height: 32 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}