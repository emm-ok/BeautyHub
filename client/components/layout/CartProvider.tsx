"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface CartContextValue {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext =
  createContext<CartContextValue | null>(
    null
  );

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const openCart = () =>
    setIsCartOpen(true);

  const closeCart = () =>
    setIsCartOpen(false);

  const toggleCart = () =>
    setIsCartOpen(
      (current) => !current
    );

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartDrawer() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartDrawer must be used inside CartProvider."
    );
  }

  return context;
}