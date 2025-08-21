import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useAuth } from "../AuthModal/useAuth";
import { createCard } from "../../utils/mapApi";
import CoffeeShopModal from "../CoffeeShopModal/CoffeeShopModal";
import SearchBar from "../SearchBar/SearchBar";
import "./MapView.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapView = ({ cards, addCard, openAddCardModal, darkMode }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-97.7431);
  const [lat, setLat] = useState(30.2672);
  const [zoom, setZoom] = useState(12);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const { isAuthenticated } = useAuth();

  const coffeeShops = [
    {
      id: 1,
      name: "Radio Coffee & Beer",
      address: "4204 Barton Springs Rd, Austin, TX 78704",
      coordinates: [-97.7673, 30.2622],
      rating: 4.5,
      reviews: 1200,
      hours: "6:00 AM - 10:00 PM",
      phone: "(512) 717-3163",
      website: "radiocoffeeandbeer.com",
      description: "Local favorite with craft coffee and beer selection",
      amenities: ["WiFi", "Outdoor Seating", "Pet Friendly", "Parking"],
      type: "demo",
    },
    {
      id: 3,
      name: "Merit Coffee",
      address: "5121 Airport Blvd, Austin, TX 78751",
      coordinates: [-97.7089, 30.2951],
      rating: 4.6,
      reviews: 650,
      hours: "7:00 AM - 7:00 PM",
      phone: "(512) 243-0089",
      website: "meritcoffee.com",
      description: "Specialty coffee roaster with minimalist design",
      amenities: ["WiFi", "Outdoor Seating", "Local Roast", "Parking"],
      type: "demo",
    },
    {
      id: 4,
      name: "Houndstooth Coffee",
      address: "401 Congress Ave, Austin, TX 78701",
      coordinates: [-97.7437, 30.2672],
      rating: 4.3,
      reviews: 1100,
      hours: "6:30 AM - 8:00 PM",
      phone: "(512) 394-4639",
      website: "houndstoothcoffee.com",
      description: "Downtown coffee shop with premium beans",
      amenities: [
        "WiFi",
        "Downtown Location",
        "Business Friendly",
        "Quick Service",
      ],
      type: "demo",
    },
    {
      id: 5,
      name: "George Howell Coffee",
      address: "709 South Lamar Blvd, Austin, TX 78704",
      coordinates: [-97.7648, 30.2595],
      rating: 4.7,
      reviews: 420,
      hours: "7:00 AM - 6:00 PM",
      phone: "(512) 555-0123",
      website: "georgehowellcoffee.com",
      description: "Award-winning specialty coffee with expert brewing",
      amenities: ["WiFi", "Expert Brewing", "Single Origin", "Tasting Notes"],
      type: "demo",
    },
  ];

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredShops(coffeeShops);
    } else {
      const filtered = coffeeShops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);

    const foundShop = coffeeShops.find(
      (shop) =>
        shop.name.toLowerCase().includes(term.toLowerCase()) ||
        shop.address.toLowerCase().includes(term.toLowerCase()) ||
        shop.description.toLowerCase().includes(term.toLowerCase())
    );

    if (!foundShop && term.trim() !== "") {
      const accessToken = mapboxgl.accessToken;
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          term
        )}.json?access_token=${accessToken}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.features && data.features.length > 0 && map.current) {
            const [lng, lat] = data.features[0].center;
            map.current.flyTo({
              center: [lng, lat],
              zoom: 14,
              speed: 2,
              curve: 1.8,
            });
          }
        })
        .catch((err) => {
          alert("Error searching for location. Please try again.");
          console.error("Mapbox geocoding error:", err);
        });
    }
  };

  useEffect(() => {
    if (map.current) return;

    try {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: darkMode
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "top-right"
      );
    } catch (error) {
      console.error(error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (mapContainer.current) {
        mapContainer.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      try {
        const style = darkMode
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11";
        map.current.setStyle(style);
      } catch (error) {
        console.error(error);
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (!map.current) return;

    markers.forEach((marker) => marker.remove());
    const newMarkers = [];

    filteredShops.forEach((shop) => {
      try {
        const el = document.createElement("div");
        el.className = "custom-marker demo-marker";
        el.style.backgroundColor = "#14b8a6";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(shop.coordinates)
          .addTo(map.current);

        el.addEventListener("click", () => {
          setSelectedShop(shop);
          setIsModalOpen(true);
        });

        newMarkers.push(marker);
      } catch (error) {
        console.error(error);
      }
    });

    if (cards && Array.isArray(cards)) {
      cards.forEach((card) => {
        try {
          if (
            card.coordinates &&
            Array.isArray(card.coordinates) &&
            card.coordinates.length === 2
          ) {
            const el = document.createElement("div");
            el.className = "custom-marker user-marker";
            el.style.backgroundColor = "#9b59b6";
            el.style.width = "20px";
            el.style.height = "20px";
            el.style.borderRadius = "50%";
            el.style.border = "2px solid white";
            el.style.cursor = "pointer";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

            const marker = new mapboxgl.Marker(el)
              .setLngLat(card.coordinates)
              .addTo(map.current);

            el.addEventListener("click", () => {
              const userShop = {
                id: card.id,
                name: card.shopName,
                address: card.address,
                coordinates: card.coordinates,
                rating: card.rating,
                description: card.notes,
                type: "user",
                userCard: card,
              };
              setSelectedShop(userShop);
              setIsModalOpen(true);
            });

            newMarkers.push(marker);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }

    setMarkers(newMarkers);
  }, [cards, darkMode, filteredShops]);

  const handleAddCard = async (cardData) => {
    try {
      if (!isAuthenticated) {
        alert("Please log in to add cards");
        return;
      }
      const newCard = await createCard(cardData);
      addCard(newCard);
    } catch (error) {
      alert("Failed to add card. Please try again.");
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShop(null);
  };

  return (
    <div className="map-container">
      <div className="map-info">
        <div className="info-header">
          <h3>Coffee Shop Explorer</h3>
          <div className="search-container">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search coffee shops..."
            />
          </div>
        </div>
        <div className="coordinates">
          <div>Longitude: {lng}</div>
          <div>Latitude: {lat}</div>
          <div>Zoom: {zoom}</div>
        </div>
      </div>

      <div ref={mapContainer} className="map" />

      <div className="map-legend">
        <h4>Pin Colors</h4>
        <div className="legend-item">
          <span>🔴 Red: Chain shops (Starbucks, Dunkin')</span>
        </div>
        {/* <div className="legend-item">
          <span>🟠 Orange: Local coffee shops</span>
        </div> */}
        {/* <div className="legend-item">
          <span>🌿 Dark Green: Restaurant/Café</span>
        </div> */}
        <div className="legend-item">
          <span>🟣 Purple: User-added locations</span>
        </div>
        <div className="legend-item">
          <span>🔷 Teal: Demo locations</span>
        </div>
      </div>

      {isAuthenticated && (
        <button
          className="add-card-fab"
          onClick={openAddCardModal}
          title="Add Coffee Card"
        >
          +
        </button>
      )}

      {isModalOpen && selectedShop && (
        <CoffeeShopModal
          shop={selectedShop}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddCard={handleAddCard}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};
export default MapView;
