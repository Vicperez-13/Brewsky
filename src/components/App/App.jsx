import React, { useState, useEffect } from "react";
import "./App.css";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import AddCardModal from "../AddCardModal/AddCardModal";
import CoffeeShopModal from "../CoffeeShopModal/CoffeeShopModal";

const App = ({ searchTerm, isAddModalOpen, setIsAddModalOpen }) => {
  const presetCoffeeShops = [
    {
      id: 1,
      name: "Starbucks",
      location: "Multiple Locations Worldwide",
      rating: 4,
      review:
        "Consistent quality and wide variety of drinks. Great for a reliable coffee experience.",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop&crop=center",
      dateAdded: "2025-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      name: "Dutch Bros Coffee",
      location: "Pacific Northwest & Southwest US",
      rating: 5,
      review:
        "Amazing energy drinks and friendly baristas! Love their seasonal specials and drive-thru service.",
      image:
        "https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=400&h=200&fit=crop&crop=center",
      dateAdded: "2025-01-02T00:00:00.000Z",
    },
    {
      id: 3,
      name: "Bluestar Coffee Roasters",
      location: "Twisp, WA",
      rating: 5,
      review:
        "Hidden gem in the beautiful Methow Valley! Exceptional locally roasted beans and cozy atmosphere.",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&crop=center",
      dateAdded: "2025-01-03T00:00:00.000Z",
    },
    {
      id: 4,
      name: "Cruisin Coffee",
      location: "Bellingham, WA",
      rating: 4,
      review:
        "Great local coffee spot with a fun nautical theme. Perfect for studying and the baristas know their craft.",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop&crop=center",
      dateAdded: "2025-01-04T00:00:00.000Z",
    },
    {
      id: 5,
      name: "Blue Bottle Coffee",
      location: "Oakland, CA (Multiple Locations)",
      rating: 4,
      review:
        "Artisanal coffee with attention to detail. Their single-origin pour-overs are exceptional.",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop&crop=center",
      dateAdded: "2025-01-05T00:00:00.000Z",
    },
  ];

  const [coffeeCards, setCoffeeCards] = useState(presetCoffeeShops);
  const [filteredCards, setFilteredCards] = useState(presetCoffeeShops);
  const [selectedCoffeeShop, setSelectedCoffeeShop] = useState(null);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredCards(coffeeCards);
    } else {
      const filtered = coffeeCards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.review &&
            card.review.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCards(filtered);
    }
  }, [searchTerm, coffeeCards]);

  const handleAddCard = (newCard) => {
    const updatedCards = [newCard, ...coffeeCards];
    setCoffeeCards(updatedCards);
  };

  const handleDeleteCard = (coffeeShopToDelete) => {
    const updatedCards = coffeeCards.filter(
      (card) => card.id !== coffeeShopToDelete.id
    );
    setCoffeeCards(updatedCards);
  };

  const handleCardClick = (coffeeShop) => {
    setSelectedCoffeeShop(coffeeShop);
    setIsShopModalOpen(true);
  };

  const handleCloseShopModal = () => {
    setIsShopModalOpen(false);
    setSelectedCoffeeShop(null);
  };

  const openModal = () => setIsAddModalOpen(true);
  const closeModal = () => setIsAddModalOpen(false);

  const cardsToDisplay = filteredCards;

  return (
    <div className="App">
      <div className="app-content">
        <div className="cards-container">
          {cardsToDisplay.length > 0 ? (
            cardsToDisplay.map((card) => (
              <CoffeeCard key={card.id} card={card} onClick={handleCardClick} />
            ))
          ) : (
            <div className="no-results">
              <p>No coffee shops found matching your search.</p>
              <p>Try searching by name or location.</p>
            </div>
          )}
        </div>
      </div>

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        onAddCard={handleAddCard}
      />

      <CoffeeShopModal
        isOpen={isShopModalOpen}
        onClose={handleCloseShopModal}
        coffeeShop={selectedCoffeeShop}
        onDelete={handleDeleteCard}
      />
    </div>
  );
};

export default App;
