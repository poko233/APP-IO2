import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const agregarProductoConId = async (id, producto) => {
  try {
    await setDoc(doc(db, "productos", id), {
      name: producto.name,
      price: producto.price,
      description: producto.description,
      image: producto.image,
    });
    console.log("Producto agregado con ID personalizado: ", id);
  } catch (error) {
    console.error("Error: ", error);
  }
};

agregarProductoConId("1", {
  name: "DeliPack",
  price: 7,
  description:
    "DeliPack es un snack de láminas enrolladas de fruta 100% natural que despierta los sentidos con cada bocado. Elaboradas a partir de pulpa pura de manzana, fresa, mango o piña, estas finas láminas combinan una textura suave y flexible con un sabor intenso. Deshidratadas cuidadosamente para conservar vitaminas, antioxidantes y fibras, ofrecen energía sostenida y dulzura natural sin azúcares añadidos. Con porciones concentradas, resultan prácticas para picar en cualquier momento del día. Libres de conservantes, colorantes y gluten, satisfacen paladares exigentes y promueven un estilo de vida saludable. Cada lámina invita a disfrutar la fruta en su forma más pura.",
  image: "https://i.ibb.co/Pv0cmkGH/Untitled-design.jpg",
});
agregarProductoConId("2", {
  name: "FrutiRoll",
  price: 5,
  description:
    "FrutiRoll es un snack de láminas de fruta deshidratada y enrollada que combina sabor auténtico con beneficios naturales. Elaboradas con pulpa pura de fresa, kiwi, durazno o arándano, conservan las fibras, vitaminas y antioxidantes de la fruta fresca. Su proceso de deshidratado lento mantiene la jugosidad y logra una textura irresistible, suave y masticable. Sin azúcares añadidos, sin aditivos artificiales y libres de gluten, son perfectas para un snack saludable y sabroso. En prácticos rollitos individuales, facilitan el consumo en cualquier ocasión y aportan energía natural todo el día. FrutiRoll 1 convierte la fruta en un bocado nutritivo y delicioso.",
  image: "https://i.ibb.co/bMQSHgdb/Untitled-design-1.jpg",
});


