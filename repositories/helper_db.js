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

const colName= "orders"
debugGetAllOrders(colName);
// Ejemplo de uso: orders ,productos
/*
deleteCollection(colName)
.then(() => console.log('Colección productos vaciada'))
.catch(console.error);
debugGetAllOrders(colName);
*/