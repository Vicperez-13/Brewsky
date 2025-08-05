import React from "react";
import "./CoffeeCard.css";

const CoffeeCard = ({ card, onClick }) => {
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
