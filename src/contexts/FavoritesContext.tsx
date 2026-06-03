import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FavoriteItemData {
  name: string;
  brand?: string | null;
  imageUrl?: string | null;
  msrp?: number | null;
  price?: number | null;
  href?: string | null;
}

interface FavoritesContextType {
  favorites: string[];
  itemsData: Record<string, FavoriteItemData>;
  addFavorite: (productId: string, data?: FavoriteItemData) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string, data?: FavoriteItemData) => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "favorites";
const DATA_KEY = "favorites_data";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [itemsData, setItemsData] = useState<Record<string, FavoriteItemData>>(() => {
    try {
      const stored = localStorage.getItem(DATA_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(itemsData));
  }, [itemsData]);

  const addFavorite = (productId: string, data?: FavoriteItemData) => {
    setFavorites((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    if (data) setItemsData((prev) => ({ ...prev, [productId]: data }));
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
    setItemsData((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const toggleFavorite = (productId: string, data?: FavoriteItemData) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId, data);
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        itemsData,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        totalFavorites: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
