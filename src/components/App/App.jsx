import React, { useState, useEffect } from "react";
import "./App.css";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import AddCardModal from "../AddCardModal/AddCardModal";
import CoffeeShopModal from "../CoffeeShopModal/CoffeeShopModal";
import MapView from "../MapView/MapView";
import FilterSort from "../FilterSort/FilterSort";
import { useToast } from "../Toast/ToastProvider";

const App = ({ searchTerm, isAddModalOpen, setIsAddModalOpen }) => {
  const toast = useToast();
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
  const [sortBy, setSortBy] = useState("date");
  const [filterOptions, setFilterOptions] = useState({
    rating: 0,
    dateRange: "all",
    nameRange: "all",
  });

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

    if (searchTerm && searchTerm.trim() !== "") {
      allCards = allCards.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.review &&
            card.review.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterOptions.rating > 0) {
      allCards = allCards.filter((card) => card.rating >= filterOptions.rating);
    }

    if (filterOptions.dateRange !== "all") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filterOptions.dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          cutoffDate = new Date(0);
      }

      allCards = allCards.filter(
        (card) => new Date(card.dateAdded) >= cutoffDate
      );
    }

    if (filterOptions.nameRange !== "all") {
      allCards = allCards.filter((card) => {
        const firstLetter = card.name.toLowerCase().charAt(0);
        switch (filterOptions.nameRange) {
          case "a-g":
            return firstLetter >= "a" && firstLetter <= "g";
          case "h-n":
            return firstLetter >= "h" && firstLetter <= "n";
          case "o-s":
            return firstLetter >= "o" && firstLetter <= "s";
          case "t-z":
            return firstLetter >= "t" && firstLetter <= "z";
          default:
            return true;
        }
      });
    }

    const sortedCards = [...allCards].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

    setFilteredCards(sortedCards);
  }, [
    searchTerm,
    coffeeCards,
    customCoffeeShops,
    currentMapLocation,
    sortBy,
    filterOptions,
  ]);

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
    try {
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

      toast.success(`${coffeeShopToDelete.name} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete coffee shop:", error);
      toast.error("Failed to delete coffee shop. Please try again.");
    }
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    toast.info(`Sorted by ${newSortBy === "date" ? "date added" : newSortBy}`);
  };

  const handleFilter = (newFilterOptions) => {
    setFilterOptions(newFilterOptions);

    if (newFilterOptions.rating > 0) {
      toast.info(`Showing ${newFilterOptions.rating}+ cup coffee shops`);
    } else if (newFilterOptions.dateRange !== "all") {
      const rangeText = {
        week: "last week",
        month: "last month",
        year: "last year",
      };
      toast.info(
        `Showing coffee shops from ${rangeText[newFilterOptions.dateRange]}`
      );
    } else if (newFilterOptions.nameRange !== "all") {
      toast.info(
        `Showing coffee shops ${newFilterOptions.nameRange.toUpperCase()}`
      );
    }
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
        <FilterSort
          onSort={handleSort}
          onFilter={handleFilter}
          totalCount={coffeeCards.length + customCoffeeShops.length}
          filteredCount={filteredCards.length}
        />

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
