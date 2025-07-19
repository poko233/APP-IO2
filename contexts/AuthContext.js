// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { loginUser, getUserData } from '../repositories/usuariosRepo';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Función para hacer login usando Firebase y tu repositorio
  const login = async (credentials) => {
    try {
      setIsLoading(true);

      // Usar tu función loginUser existente
      const firebaseUser = await loginUser(credentials.email, credentials.password);
      
      // Obtener datos adicionales del usuario desde tu base de datos
      const userData = await getUserData(firebaseUser.uid);

      // Guardar datos del usuario
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...userData // Aquí se incluirá el rol y otros datos
      });
      
      setUserRole(userData.rol); // Assuming your userData has 'rol' field
      setIsAuthenticated(true);

      // Guardar en AsyncStorage para persistir algunos datos si es necesario
      await AsyncStorage.setItem('userData', JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...userData
      }));

      return { success: true, user: firebaseUser };

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para logout
  const logout = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('userData');
      
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Verificar autenticación usando Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setIsLoading(true);
        
        if (firebaseUser) {
          // Usuario autenticado con Firebase
          try {
            // Obtener datos adicionales del usuario desde tu base de datos
            const userData = await getUserData(firebaseUser.uid);
            
            const completeUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            };

            setUser(completeUser);
            setUserRole(userData.rol);
            setIsAuthenticated(true);

            // Guardar datos
            await AsyncStorage.setItem('userData', JSON.stringify(completeUser));
            
            
          } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            // Si no se pueden obtener los datos, usar solo los de Firebase
            const basicUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            };
            
            setUser(basicUser);
            setUserRole(null); // No role available
            setIsAuthenticated(true);
          }
        } else {
          // Usuario no autenticado
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem('userData');
        }

      } catch (error) {
        console.error('Error en auth state change:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Función helper para verificar rol específico
  const hasRole = (requiredRole) => {
    if (!userRole || !isAuthenticated) return false;
    
    // Si es admin, tiene acceso a todo
    if (userRole === 'admin') return true;
    
    // Verificar rol específico
    return userRole === requiredRole;
  };

  // Función helper para verificar múltiples roles
  const hasAnyRole = (roles) => {
    if (!userRole || !isAuthenticated) return false;
    
    // Si es admin, tiene acceso a todo
    if (userRole === 'admin') return true;
    
    return roles.includes(userRole);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      userRole,
      login,
      logout,
      hasRole,
      hasAnyRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};