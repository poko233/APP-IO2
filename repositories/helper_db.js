import { db } from "../config/firebaseConfig.js";
import { doc, getDoc, getDocs, collection,addDoc, writeBatch   } from "firebase/firestore";

// Función simple para recuperar todos los pedidos y mostrarlos en consola
const debugGetAllOrders = async ( collectionName) => {
  try {
    console.log(typeof db)
    console.log('🔍 Recuperando todos los pedidos...');
    
    const ordersRef = collection(db, collectionName);
    const querySnapshot = await getDocs(ordersRef);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('📋 TODOS LOS DOC:');
    console.log('=====================');
    console.log(orders);
    console.log('=====================');
    console.log(`Total de DOC encontrados: ${orders.length}`);
    
    return orders;
  } catch (error) {
    console.error('❌ Error al recuperar pedidos:', error);
    throw error;
  }
};
/**
 * Borra todos los documentos de una colección de Firestore.
 * @param {string} collectionName El nombre de la colección a vaciar.
 */
async function deleteCollection(collectionName) {
  try {
    console.log(`🗑️ Borrando documentos de la colección "${collectionName}"...`);

    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('✅ La colección ya está vacía.');
      return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
    console.log(`✅ Se borraron ${snapshot.docs.length} documentos de "${collectionName}".`);
  } catch (error) {
    console.error(`❌ Error al borrar colección "${collectionName}":`, error);
    throw error;
  }
}

async function deleteAnonymousUsersFlexible(collectionName) {
  try {
    console.log(`🗑️ Buscando usuarios anónimos en la colección "${collectionName}"...`);

    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('✅ La colección está vacía.');
      return;
    }

    const batch = writeBatch(db);
    let deletedCount = 0;

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const userName = data.userName || '';
      
      // Condiciones para considerar un usuario como "anónimo"
      const isAnonymous = 
        userName === "Usuario Anónimo" ||
        userName === "Usuario Anonimo" ||
        userName === "" ||
        userName === "No disponible" ||
        userName === null ||
        userName === undefined ||
        userName.toLowerCase().includes("anónimo") ||
        userName.toLowerCase().includes("anonimo");

      if (isAnonymous) {
        batch.delete(docSnap.ref);
        console.log(`🎯 Marcando para eliminar: ${docSnap.id} - "${userName}"`);
        deletedCount++;
      }
    });

    if (deletedCount === 0) {
      console.log('✅ No se encontraron usuarios anónimos para eliminar.');
      return 0;
    }

    await batch.commit();
    console.log(`✅ Se eliminaron ${deletedCount} usuarios anónimos de "${collectionName}".`);
    
    return deletedCount;
  } catch (error) {
    console.error(`❌ Error al eliminar usuarios anónimos de "${collectionName}":`, error);
    throw error;
  }
}
const colName= "orders"
debugGetAllOrders(colName);
deleteAnonymousUsersFlexible(colName)
debugGetAllOrders(colName);
// Ejemplo de uso: orders ,productos
/*
deleteCollection(colName)
.then(() => console.log('Colección productos vaciada'))
.catch(console.error);
debugGetAllOrders(colName);
*/