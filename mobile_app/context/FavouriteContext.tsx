import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouriteContext = createContext<any>(null);

export const FavouriteProvider = ({ children }: any) => {

  const [favourites, setFavourites] = useState<any[]>([]);

  //fav on load
  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favourites');

      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading favourites", error);
    }
  };

  // save fav
  useEffect(() => {
    saveFavourites();
  }, [favourites]);

  const saveFavourites = async () => {
    try {
      await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
    } catch (error) {
      console.log("Error saving favourites", error);
    }
  };

  // fav toggle
  const toggleFavourite = (product: any) => {
    setFavourites((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isFavourite = (id: string) => {
    return favourites.some((p) => p.id === id);
  };

  return (
    <FavouriteContext.Provider
      value={{ favourites, toggleFavourite, isFavourite }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => useContext(FavouriteContext);