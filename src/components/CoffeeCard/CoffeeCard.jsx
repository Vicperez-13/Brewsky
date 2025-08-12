import React, { useState } from "react";
import { useAuth } from "../AuthModal/AuthModal";
import "./CoffeeCard.css";

const CoffeeCard = ({
  card,
  onClick,
  isFavorite: propIsFavorite,
  onDelete,
}) => {
  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } =
    useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cardIsFavorite =
    propIsFavorite !== undefined ? propIsFavorite : isFavorite(card.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to add favorites");
      return;
    }

    if (cardIsFavorite) {
      removeFromFavorites(card.id);
    } else {
      addToFavorites(card);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to delete cards");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    onDelete(card);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  const renderCoffeeMugs = (rating) => {
    const mugs = [];
    for (let i = 1; i <= 5; i++) {
      mugs.push(
        <span key={i} className={`card-mug ${i <= rating ? "filled" : ""}`}>
          ☕
        </span>
      );
    }
    return mugs;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="CoffeeCard" onClick={() => onClick(card)}>
      {isAuthenticated && (
        <>
          <button
            className={`favorite-btn ${cardIsFavorite ? "favorited" : ""}`}
            onClick={handleFavoriteClick}
            title={
              cardIsFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {cardIsFavorite ? "🫘" : "�"}
          </button>

          {card.isUserAdded && onDelete && (
            <button
              className="delete-btn"
              onClick={handleDeleteClick}
              title="Delete this card"
            >
              Delete
            </button>
          )}
        </>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={cancelDelete}>
          <div
            className="delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Coffee Shop</h3>
            <p>Are you sure you want to delete "{card.name}"?</p>
            <div className="delete-confirm-actions">
              <button className="cancel-delete-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {card.image && (
        <div className="card-image">
          <img src={card.image} alt={card.name} />
          {card.isUserAdded && (
            <div className="user-added-badge">👤 User Added</div>
          )}
        </div>
      )}

      <div className="card-content">
        <h3 className="card-name">{card.name}</h3>

        <div className="card-location">📍 {card.location}</div>

        <div className="card-rating">
          <div className="rating-mugs">{renderCoffeeMugs(card.rating)}</div>
          <span className="rating-text">{card.rating}/5</span>
        </div>

        {card.review && (
          <div className="card-review">
            <p>"{card.review}"</p>
          </div>
        )}

        <div className="card-date">Added on {formatDate(card.dateAdded)}</div>
      </div>
    </div>
  );
};

export default CoffeeCard;
