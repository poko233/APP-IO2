import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      // Si ya existe, aumenta cantidad; si no, lo añade con qty 1
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      };
    
    case "REMOVE_ITEM":
      return { items: state.items.filter(i => i.id !== action.payload) };
    
    case "CLEAR_CART":
      return initialState;
    
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = product =>
    dispatch({ type: "ADD_ITEM", payload: product });
  
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  
  const removeFromCart = id =>
    dispatch({ type: "REMOVE_ITEM", payload: id });
  
  const clearCart = () =>
    dispatch({ type: "CLEAR_CART" });

  const totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}