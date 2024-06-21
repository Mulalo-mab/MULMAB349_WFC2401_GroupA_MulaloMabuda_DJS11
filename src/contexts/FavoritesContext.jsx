import React, { createContext, useState, useContext } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});

  const addFavorite = (episode) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [episode.id]: { ...episode, addedAt: new Date().toISOString() }, // Include addedAt property
    }));
  };

  const removeFavorite = (episodeId) => {
    setFavorites((prevFavorites) => {
      const { [episodeId]: _, ...updatedFavorites } = prevFavorites;
      return updatedFavorites;
    });
  };

  const isFavorite = (episodeId) => {
    return !!favorites[episodeId];
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
