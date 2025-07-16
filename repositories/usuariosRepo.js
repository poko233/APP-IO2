import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

//iniciar sesión
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

//obtener datos del usuario (para saber su rol, etc)
export const getUserData = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Usuario no encontrado");
  }
};

export const getProducts = async () => {
  try {
    if (!db) {
      throw new Error("Database no inicializada");
    }
    const querySnapshot = await getDocs(collection(db, "productos"));
    if (querySnapshot.empty) {
      return [];
    }
    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    return products;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, "productos", productId);
    const docSnap = await getDoc(productRef);
    
    if (docSnap.exists()) {
      const product = {
        id: docSnap.id,
        ...docSnap.data(),
      };
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw new Error(`Error al obtener producto: ${error.message}`);
  }
};
