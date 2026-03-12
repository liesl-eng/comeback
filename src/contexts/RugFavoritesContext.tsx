import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface SavedPattern {
  id: string; // "CollectionName::DesignName"
  collectionName: string;
  designName: string;
  image: string;
  sizes: { size: string; units: number }[];
}

interface RugFavoritesContextType {
  savedPatterns: SavedPattern[];
  togglePattern: (pattern: SavedPattern) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
  totalSaved: number;
  savedSummary: string; // e.g. "Ripon (Lotus), Brooklyn Trellis (Kings Court)"
}

const RugFavoritesContext = createContext<RugFavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "rug-program-favorites";

export const RugFavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPatterns));
  }, [savedPatterns]);

  const togglePattern = useCallback((pattern: SavedPattern) => {
    setSavedPatterns((prev) => {
      const exists = prev.some((p) => p.id === pattern.id);
      if (exists) {
        return prev.filter((p) => p.id !== pattern.id);
      }
      return [...prev, pattern];
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => savedPatterns.some((p) => p.id === id),
    [savedPatterns]
  );

  const clearAll = useCallback(() => setSavedPatterns([]), []);

  const savedSummary = savedPatterns
    .map((p) => `${p.designName} (${p.collectionName})`)
    .join(", ");

  return (
    <RugFavoritesContext.Provider
      value={{ savedPatterns, togglePattern, isSaved, clearAll, totalSaved: savedPatterns.length, savedSummary }}
    >
      {children}
    </RugFavoritesContext.Provider>
  );
};

export const useRugFavorites = () => {
  const context = useContext(RugFavoritesContext);
  if (!context) {
    throw new Error("useRugFavorites must be used within a RugFavoritesProvider");
  }
  return context;
};
