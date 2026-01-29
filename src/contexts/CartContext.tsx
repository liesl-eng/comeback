import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product, PalletCartItem } from "@/types/product";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  palletItems: PalletCartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addPallet: (pallet: Omit<PalletCartItem, 'quantity'>) => void;
  removePallet: (palletId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [palletItems, setPalletItems] = useState<PalletCartItem[]>([]);

  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        toast.success("Updated order request quantity");
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      toast.success("Item added to order request");
      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
    toast.success("Removed from order request");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addPallet = (pallet: Omit<PalletCartItem, 'quantity'>) => {
    setPalletItems((current) => {
      const exists = current.find((p) => p.palletId === pallet.palletId);
      if (exists) {
        toast.info("Pallet already in order request");
        return current;
      }
      toast.success("Pallet added to order request");
      return [...current, { ...pallet, quantity: 1 }];
    });
  };

  const removePallet = (palletId: string) => {
    setPalletItems((current) => current.filter((p) => p.palletId !== palletId));
    toast.success("Pallet removed from order request");
  };

  const clearCart = () => {
    setItems([]);
    setPalletItems([]);
    toast.success("Order request cleared");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0) + palletItems.length;
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.discountedPrice * item.quantity,
    0
  ) + palletItems.reduce((sum, p) => sum + p.totalCost, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        palletItems,
        addItem,
        removeItem,
        updateQuantity,
        addPallet,
        removePallet,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
