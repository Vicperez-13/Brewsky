import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthModal/useAuth";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import SearchBar from "../SearchBar/SearchBar";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {
    if (!user?.favorites) {
      setFilteredFavorites([]);
      return;
    }

    if (searchTerm.trim() === "") {
      setFilteredFavorites(user.favorites);
    } else {
      const filtered = user.favorites.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.review.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  }, [searchTerm, user?.favorites]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (!isAuthenticated) {
    return (
      <div className="favorites-page">
        <div className="not-logged-in">
          <h2>Please log in to view your favorites</h2>
          <p>Sign in to save and view your favorite coffee shops!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Coffee Shops</h1>
        <p>Your curated collection of amazing coffee experiences</p>

        <div className="favorites-search">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search your favorites..."
          />
        </div>
      </div>

      <div className="favorites-content">
        {filteredFavorites.length > 0 ? (
          <ul className="favorites-grid">
            {filteredFavorites.map((favorite) => (
              <li key={favorite.id} className="favorite-card-wrapper">
                <CoffeeCard
                  card={favorite}
                  onClick={() => {}}
                  isFavorite={true}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-favorites">
            {user?.favorites?.length === 0 ? (
              <>
                <div className="no-favorites-icon">☕</div>
                <h3>No favorites yet!</h3>
                <p>
                  Start exploring coffee shops and add them to your favorites by
                  clicking the heart icon.
                </p>
              </>
            ) : (
              <>
                <div className="no-favorites-icon">🔍</div>
                <h3>No favorites match your search</h3>
                <p>
                  Try searching with different keywords or clear your search to
                  see all favorites.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
