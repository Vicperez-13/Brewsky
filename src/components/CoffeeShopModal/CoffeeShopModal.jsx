import React, { useState } from "react";
import { useAuth } from "../AuthModal/AuthModal";
import "./CoffeeShopModal.css";

const CoffeeShopModal = ({
  isOpen,
  onClose,
  coffeeShop,
  onDelete,
  onUpdate,
}) => {
  const {
    user,
    isAuthenticated,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    rating: 0,
    review: "",
  });

  const canEdit = isAuthenticated && coffeeShop?.isUserAdded;

  if (!isOpen || !coffeeShop) return null;

  const handleDelete = () => {
    onDelete(coffeeShop);
    onClose();
  };

  const handleEdit = () => {
    setEditForm({
      name: coffeeShop.name,
      location: coffeeShop.location,
      rating: coffeeShop.rating,
      review: coffeeShop.review || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(coffeeShop.id, editForm);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      location: "",
      rating: 0,
      review: "",
    });
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      alert("Please log in to add favorites");
      return;
    }

    if (isFavorite(coffeeShop.id)) {
      removeFromFavorites(coffeeShop.id);
    } else {
      addToFavorites(coffeeShop);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const renderCoffeeMugs = (rating) => {
    const mugs = [];
    for (let i = 1; i <= 5; i++) {
      mugs.push(
        <span key={i} className={`modal-mug ${i <= rating ? "filled" : ""}`}>
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
      month: "long",
      day: "numeric",
    });
  };

  const additionalImages = [
    coffeeShop.image,
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
  ];

  const sampleComments = [
    {
      id: 1,
      author: "Coffee Lover",
      date: "2025-01-15",
      text: "Amazing atmosphere and the best latte I've had in years!",
      rating: 5,
    },
    {
      id: 2,
      author: "Local Regular",
      date: "2025-01-10",
      text: "Great place to work remotely. Fast WiFi and comfortable seating.",
      rating: 4,
    },
    {
      id: 3,
      author: "Traveler123",
      date: "2025-01-05",
      text: "Stumbled upon this gem during my road trip. Highly recommend!",
      rating: 5,
    },
  ];

  const sampleMenu = {
    "Hot Drinks": [
      { name: "Espresso", price: "$2.50" },
      { name: "Americano", price: "$3.00" },
      { name: "Latte", price: "$4.50" },
      { name: "Cappuccino", price: "$4.00" },
      { name: "Mocha", price: "$5.00" },
    ],
    "Cold Drinks": [
      { name: "Iced Coffee", price: "$3.50" },
      { name: "Cold Brew", price: "$4.00" },
      { name: "Iced Latte", price: "$5.00" },
      { name: "Frappuccino", price: "$5.50" },
    ],
    Food: [
      { name: "Croissant", price: "$3.00" },
      { name: "Muffin", price: "$2.75" },
      { name: "Sandwich", price: "$8.50" },
      { name: "Bagel", price: "$4.00" },
    ],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="CoffeeShopModal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            {!isEditing ? (
              <>
                <h2>{coffeeShop.name}</h2>
                <div className="location-date">
                  <p className="location">📍 {coffeeShop.location}</p>
                  <p className="date-added">
                    Added {formatDate(coffeeShop.dateAdded)}
                  </p>
                </div>
                <div className="rating-display">
                  <div className="rating-mugs">
                    {renderCoffeeMugs(coffeeShop.rating)}
                  </div>
                  <span className="rating-text">{coffeeShop.rating}/5</span>
                </div>
              </>
            ) : (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Coffee shop name"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder="Location"
                  className="edit-input"
                />
                <div className="rating-edit">
                  <label>Rating:</label>
                  <select
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="edit-select"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} ☕
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={editForm.review}
                  onChange={(e) =>
                    setEditForm({ ...editForm, review: e.target.value })
                  }
                  placeholder="Your review..."
                  className="edit-textarea"
                  rows="3"
                />
              </div>
            )}
          </div>
          <div className="header-actions">
            {isAuthenticated && (
              <button
                className={`favorite-button ${
                  isFavorite(coffeeShop.id) ? "favorited" : ""
                }`}
                onClick={handleFavoriteToggle}
                title={
                  isFavorite(coffeeShop.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {isFavorite(coffeeShop.id) ? "🫘" : "�"}
              </button>
            )}
            {canEdit && !isEditing && (
              <button className="edit-button" onClick={handleEdit}>
                ✏️
              </button>
            )}
            {isEditing && (
              <>
                <button className="save-button" onClick={handleSaveEdit}>
                  💾
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  ❌
                </button>
              </>
            )}
            {canEdit && !isEditing && (
              <button className="delete-button" onClick={confirmDelete}>
                🗑️
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete "{coffeeShop.name}"?</p>
            <div className="delete-actions">
              <button className="confirm-delete" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-delete" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`tab ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            Menu
          </button>
        </div>

        <div className="modal-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="main-image">
                <img src={coffeeShop.image} alt={coffeeShop.name} />
              </div>
              <div className="overview-details">
                <h3>My Review</h3>
                <p className="my-review">"{coffeeShop.review}"</p>

                <div className="quick-stats">
                  <div className="stat">
                    <strong>Rating:</strong> {coffeeShop.rating}/5
                  </div>
                  <div className="stat">
                    <strong>Location:</strong> {coffeeShop.location}
                  </div>
                  <div className="stat">
                    <strong>Added:</strong> {formatDate(coffeeShop.dateAdded)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="photos-tab">
              <div className="photos-grid">
                {additionalImages.map((image, index) => (
                  <div key={index} className="photo-item">
                    <img
                      src={image}
                      alt={`${coffeeShop.name} photo ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-tab">
              <div className="my-review-section">
                <h3>My Review</h3>
                <div className="review-card my-review-card">
                  <div className="review-header">
                    <strong>You</strong>
                    <div className="review-rating">
                      {renderCoffeeMugs(coffeeShop.rating)}
                    </div>
                  </div>
                  <p>"{coffeeShop.review}"</p>
                  <small>{formatDate(coffeeShop.dateAdded)}</small>
                </div>
              </div>

              <div className="other-reviews-section">
                <h3>Other Reviews</h3>
                {sampleComments.map((comment) => (
                  <div key={comment.id} className="review-card">
                    <div className="review-header">
                      <strong>{comment.author}</strong>
                      <div className="review-rating">
                        {renderCoffeeMugs(comment.rating)}
                      </div>
                    </div>
                    <p>"{comment.text}"</p>
                    <small>{formatDate(comment.date)}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="menu-tab">
              {Object.entries(sampleMenu).map(([category, items]) => (
                <div key={category} className="menu-category">
                  <h3>{category}</h3>
                  <div className="menu-items">
                    {items.map((item, index) => (
                      <div key={index} className="menu-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeShopModal;
