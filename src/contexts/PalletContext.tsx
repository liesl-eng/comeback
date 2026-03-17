import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

export interface PalletItem {
  product: Product;
  quantity: number;
}

interface PalletContextType {
  items: PalletItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearPallet: () => void;
  totalItems: number;
  totalPrice: number;
  amountToMinimum: number;
  isMinimumMet: boolean;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
}

const PALLET_STORAGE_KEY = "comeback-pallet-items";
const MINIMUM_ORDER = 5000;

const PalletContext = createContext<PalletContextType | undefined>(undefined);

const loadFromStorage = (): PalletItem[] => {
  try {
    const stored = localStorage.getItem(PALLET_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
};

export const PalletProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<PalletItem[]>(loadFromStorage);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem(PALLET_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
    toast.success("Removed from pallet");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearPallet = useCallback(() => {
    setItems([]);
    toast.success("Pallet cleared");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.discountedPrice * item.quantity,
    0
  );
  const amountToMinimum = Math.max(0, MINIMUM_ORDER - totalPrice);
  const isMinimumMet = totalPrice >= MINIMUM_ORDER;

  return (
    <PalletContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearPallet,
        totalItems,
        totalPrice,
        amountToMinimum,
        isMinimumMet,
        isExpanded,
        setIsExpanded,
      }}
    >
      {children}
    </PalletContext.Provider>
  );
};

export const usePallet = () => {
  const context = useContext(PalletContext);
  if (!context) {
    throw new Error("usePallet must be used within a PalletProvider");
  }
  return context;
};
