import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { getProducts } from "./usuariosRepo.js";

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

const productos = [
  {
    image:
      "https://www.conasi.eu/blog/wp-content/uploads/2022/07/l%C3%A1minas-de-fruta-deshidratada-d.jpg",
  },
  {
    image:
      "https://www.conasi.eu/blog/wp-content/uploads/2022/07/l%C3%A1minas-de-fruta-deshidratada-1.jpg",
  },
  {
    image:
      "https://mercaditodigital.com.bo/wp-content/uploads/2023/09/laminas.jpg",
  },
  {
    image: "https://i.ytimg.com/vi/fzMKpdxMpBg/sddefault.jpg",
  },
];

agregarProductoConId("2", {
  name: "Presentacion 1",
  price: 9,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
  image: "https://mercaditodigital.com.bo/wp-content/uploads/2023/09/laminas.jpg",
});

