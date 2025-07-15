import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc, getDocs } from "firebase/firestore";

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

// obtener los productos de la base de datos
export const getProducts = async () => {
  const productsRef = doc(db, "productos");
  const docSnap = await getDocs(productsRef);
  if (docSnap.exists()) {
    return docSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } else {
    throw new Error("Productos no encontrados");
  }
};
