import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { favouriteApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { mapBackendProduct } from '@/lib/product-utils';
import { Product } from '@/types/product';

// ─── Types ─────────────────────────────────────────────────────────────────

interface FavouriteContextType {
  favourites: Product[];
  toggleFavourite: (product: Product) => Promise<void>;
  isFavourite: (id: string) => boolean;
  isLoading: boolean;
}

// ─── Context ────────────────────────────────────────────────────────────────

const FavouriteContext = createContext<FavouriteContextType | undefined>(undefined);

// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'favourites';

async function loadFromStorage(): Promise<Product[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Product[]) : [];
}

async function saveToStorage(items: Product[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function FavouriteProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavourites = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        const response = await favouriteApi.getFavourites();
        setFavourites(response.map(mapBackendProduct));
      } else {
        const local = await loadFromStorage();
        setFavourites(local);
      }
    } catch (error) {
      console.error('[FavouriteContext] Failed to load favourites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Reload whenever auth state changes (login / logout)
  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // Persist to AsyncStorage only when logged out
  useEffect(() => {
    if (!token) {
      saveToStorage(favourites).catch((error) =>
        console.error('[FavouriteContext] Failed to save favourites locally:', error)
      );
    }
  }, [favourites, token]);

  const toggleFavourite = useCallback(
    async (product: Product) => {
      const isFav = favourites.some((p) => p.id === product.id);

      // Optimistic update — instant UI feedback
      setFavourites((prev) =>
        isFav ? prev.filter((p) => p.id !== product.id) : [...prev, product]
      );

      if (token) {
        try {
          if (isFav) {
            await favouriteApi.removeFavourite(product.id);
          } else {
            await favouriteApi.addFavourite(product.id);
          }
        } catch (error) {
          console.error('[FavouriteContext] Failed to sync with backend, reverting:', error);
          // Revert optimistic update on failure
          setFavourites((prev) =>
            isFav ? [...prev, product] : prev.filter((p) => p.id !== product.id)
          );
        }
      }
    },
    [favourites, token]
  );

  const isFavourite = useCallback(
    (id: string) => favourites.some((p) => p.id === id),
    [favourites]
  );

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite, isFavourite, isLoading }}>
      {children}
    </FavouriteContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useFavourite(): FavouriteContextType {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error('useFavourite must be used within a FavouriteProvider');
  }
  return context;
}