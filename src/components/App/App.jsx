import React, { useState, useEffect } from "react";
import "./App.css";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import AddCardModal from "../AddCardModal/AddCardModal";
import CoffeeShopModal from "../CoffeeShopModal/CoffeeShopModal";
import MapView from "../MapView/MapView";

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
  const [customCoffeeShops, setCustomCoffeeShops] = useState([]);
  const [filteredCards, setFilteredCards] = useState(presetCoffeeShops);
  const [selectedCoffeeShop, setSelectedCoffeeShop] = useState(null);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [currentMapLocation, setCurrentMapLocation] = useState(null);

  useEffect(() => {
    const savedCustomShops = localStorage.getItem("customCoffeeShops");
    if (savedCustomShops) {
      try {
        const parsedShops = JSON.parse(savedCustomShops);
        setCustomCoffeeShops(parsedShops);
      } catch (error) {}
    }
  }, []);

  const getNearbyCustomCards = (mapLat, mapLng) => {
    if (!mapLat || !mapLng || !customCoffeeShops.length) return [];

    return customCoffeeShops
      .filter((shop) => {
        if (!shop.coordinates || shop.coordinates.length !== 2) return false;

        const distance = Math.sqrt(
          Math.pow(shop.coordinates[0] - mapLng, 2) +
            Math.pow(shop.coordinates[1] - mapLat, 2)
        );

        return distance < 0.05;
      })
      .map((shop) => ({
        id: shop.id.replace("custom-", ""),
        name: shop.name,
        location: shop.address,
        rating: shop.rating || 0,
        review: shop.review || "User-added coffee shop",
        image:
          shop.image ||
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop",
        dateAdded: shop.dateAdded,
        coordinates: shop.coordinates,
        isUserAdded: true,
      }));
  };

  useEffect(() => {
    let allCards = [...coffeeCards];

    if (currentMapLocation) {
      const nearbyCustomCards = getNearbyCustomCards(
        currentMapLocation.lat,
        currentMapLocation.lng
      );

      const existingIds = new Set(allCards.map((card) => card.id));
      const newCustomCards = nearbyCustomCards.filter(
        (card) => !existingIds.has(card.id)
      );
      allCards = [...allCards, ...newCustomCards];
    }

    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredCards(allCards);
    } else {
      const filtered = allCards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.review &&
            card.review.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCards(filtered);
    }
  }, [searchTerm, coffeeCards, customCoffeeShops, currentMapLocation]);

  const handleAddCard = (newCard) => {
    const updatedCards = [newCard, ...coffeeCards];
    setCoffeeCards(updatedCards);

    if (newCard.coordinates) {
      const customShop = {
        id: `custom-${newCard.id}`,
        name: newCard.name,
        address: newCard.location,
        coordinates: newCard.coordinates,
        category: "Coffee Shop",
        type: "user-added",
        rating: newCard.rating,
        review: newCard.review,
        image: newCard.image,
        dateAdded: newCard.dateAdded,
      };

      const updatedCustomShops = [customShop, ...customCoffeeShops];
      setCustomCoffeeShops(updatedCustomShops);

      localStorage.setItem(
        "customCoffeeShops",
        JSON.stringify(updatedCustomShops)
      );
    }
  };

  const handleDeleteCard = (coffeeShopToDelete) => {
    const updatedCards = coffeeCards.filter(
      (card) => card.id !== coffeeShopToDelete.id
    );
    setCoffeeCards(updatedCards);

    const updatedCustomShops = customCoffeeShops.filter(
      (shop) => shop.id !== `custom-${coffeeShopToDelete.id}`
    );
    setCustomCoffeeShops(updatedCustomShops);
    localStorage.setItem(
      "customCoffeeShops",
      JSON.stringify(updatedCustomShops)
    );
  };

  const handleCardClick = (coffeeShop) => {
    setSelectedCoffeeShop(coffeeShop);
    setIsShopModalOpen(true);
  };

  const handleCloseShopModal = () => {
    setIsShopModalOpen(false);
    setSelectedCoffeeShop(null);
  };

  const handleMapCoffeeShopSelect = (mapShop) => {
    const coffeeShop = {
      id: mapShop.id,
      name: mapShop.name,
      location: mapShop.address,
      rating: 0,
      review: `Discovered coffee shop at ${mapShop.address}`,
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop",
      dateAdded: new Date().toISOString(),
      coordinates: mapShop.coordinates,
    };

    setSelectedCoffeeShop(coffeeShop);
    setIsShopModalOpen(true);
  };

  const handleMapLocationChange = (lat, lng) => {
    setCurrentMapLocation({ lat, lng });
  };

  const openModal = () => setIsAddModalOpen(true);
  const closeModal = () => setIsAddModalOpen(false);

  const cardsToDisplay = filteredCards;

  return (
    <div className="App">
      <div className="app-content">
        <div className="cards-container">
          <div className="map-card-wrapper">
            <MapView
              cards={customCoffeeShops}
              addCard={handleAddCard}
              openAddCardModal={openModal}
              darkMode={false}
            />
          </div>

          {cardsToDisplay.length > 0 ? (
            cardsToDisplay.map((card) => (
              <CoffeeCard
                key={card.id}
                card={card}
                onClick={handleCardClick}
                onDelete={handleDeleteCard}
              />
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
