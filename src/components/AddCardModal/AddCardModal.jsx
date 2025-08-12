import React, { useState } from "react";
import "./AddCardModal.css";
import { searchLocation } from "../../utils/mapApi";
import { useAuth } from "../AuthModal/AuthModal";
import { useToast } from "../Toast/ToastProvider";
import Loading from "../Loading/Loading";

const AddCardModal = ({ isOpen, onClose, onAddCard }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 0,
    review: "",
    image: "",
    coordinates: null,
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "location" ? { coordinates: null } : {}),
    }));

    if (name === "location" && value.length > 2) {
      handleLocationSearch(value);
    } else if (name === "location" && value.length <= 2) {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSearch = async (query) => {
    setIsLoadingLocation(true);
    try {
      const suggestions = await searchLocation(query);
      setLocationSuggestions(suggestions.slice(0, 5));
    } catch (error) {
      console.error("Location search failed:", error);
      setLocationSuggestions([]);
      toast.error("Failed to search locations. Please try again.");
    }
    setIsLoadingLocation(false);
  };

  const selectLocation = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      location: suggestion.display_name,
      coordinates: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
    }));
    setLocationSuggestions([]);
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Coffee shop name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.coordinates) {
      newErrors.location = "Please select a location from the suggestions";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.review.trim()) {
      newErrors.review = "Review is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to add coffee shops");
      onClose();
      return;
    }

    setShowErrors(true);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await onAddCard({
          ...formData,
          id: Date.now(),
          dateAdded: new Date().toISOString(),
          isUserAdded: true,
        });

        setFormData({
          name: "",
          location: "",
          rating: 0,
          review: "",
          image: "",
          coordinates: null,
        });
        setLocationSuggestions([]);
        setErrors({});
        setShowErrors(false);

        toast.success(`${formData.name} added successfully!`);
        onClose();
      } catch (error) {
        console.error("Failed to add coffee shop:", error);
        toast.error("Failed to add coffee shop. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Please fix the errors in the form");
    }
  };

  const renderCoffeeMugRating = () => {
    const mugs = [];
    for (let i = 1; i <= 5; i++) {
      mugs.push(
        <button
          key={i}
          type="button"
          className={`rating-mug ${i <= formData.rating ? "filled" : ""}`}
          onClick={() => handleRatingClick(i)}
        >
          ☕
        </button>
      );
    }
    return mugs;
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="AddCardModal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Login Required</h2>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <div
            className="modal-form"
            style={{ padding: "20px", textAlign: "center" }}
          >
            <p>Please log in to add coffee shops to your collection.</p>
            <button
              onClick={onClose}
              style={{
                background: "#4A4A4A",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="AddCardModal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Coffee Shop</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Coffee Shop Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={showErrors && errors.name ? "error" : ""}
            />
            {showErrors && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Start typing to search locations..."
              className={showErrors && errors.location ? "error" : ""}
            />
            {showErrors && errors.location && (
              <span className="error-message">{errors.location}</span>
            )}
            {isLoadingLocation && (
              <div className="loading-container">
                <Loading size="small" message="Searching locations..." />
              </div>
            )}
            {locationSuggestions.length > 0 && (
              <ul className="location-suggestions">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectLocation(suggestion)}
                    className="location-suggestion"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <div className="rating-container">
              {renderCoffeeMugRating()}
              <span className="rating-number">{formData.rating}/5</span>
            </div>
            {showErrors && errors.rating && (
              <span className="error-message">{errors.rating}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="review">Review</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              rows="4"
              placeholder="Share your thoughts about this coffee shop..."
              className={showErrors && errors.review ? "error" : ""}
            />
            {showErrors && errors.review && (
              <span className="error-message">{errors.review}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${
                isSubmitting ? "loading-button" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loading size="small" message="" />
              ) : (
                "Add Coffee Shop"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
