import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  service: {
    id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  addItem: (service: { id: string; title: string; price: number }) => void;
  addToCart: (service: { id: string; title: string; price: number }) => void;
  removeItem: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (service: { id: string; title: string; price: number }) => {
    setItems((prev) => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: service.id,
        service: {
          id: service.id,
          title: service.title,
          price: service.price
        },
        quantity: 1
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Alias for addItem to match expected interface
  const addToCart = addItem;

  // Function to get cart item count
  const getCartItemCount = () => itemCount;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
