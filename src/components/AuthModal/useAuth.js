import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: false,
      user: null,
      login: () => {},
      logout: () => {},
      updateUser: () => {},
      addToFavorites: () => {},
      removeFromFavorites: () => {},
      isFavorite: () => false,
    };
  }
  return context;
};
