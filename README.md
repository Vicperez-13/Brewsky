# ☕ Brewsky - Coffee Shop Discovery App

[GHP](https://vicperez-13.github.io/Brewsky/)

Brewsky is a modern web application for discovering, reviewing, and managing your favorite coffee shops. Built with React and powered by interactive maps, it helps coffee enthusiasts find great spots and keep track of their caffeine adventures.

## ✨ Features

### 🗺️ **Interactive Map**

- Browse coffee shops on an interactive Mapbox-powered map
- View different types of locations with color-coded markers
- Search for locations with real-time geocoding

### 📱 **Coffee Shop Management**

- **Browse Curated Shops**: Discover popular coffee chains and local favorites
- **Add Your Own**: Create custom coffee shop entries with photos, reviews, and ratings
- **Delete Your Cards**: Remove coffee shops you've added (authenticated users only)
- **Smart Search**: Find shops by name, location, or review content

### ⭐ **Personal Collections**

- **Favorites System**: Save your favorite coffee shops for quick access
- **User Authentication**: Secure login to manage your personal collection
- **Rating System**: Rate coffee shops from 1-5 coffee mugs ☕

### 🎨 **Modern UI/UX**

- Responsive design that works on desktop and mobile
- Beautiful glassmorphism effects and smooth animations
- Coffee-themed color palette with warm, inviting aesthetics

### Prerequisites

- Node.js

## 🛠️ Built With

- **Frontend Framework**: React 18 with Vite
- **Mapping**: Mapbox GL JS for interactive maps
- **Geocoding**: OpenStreetMap Nominatim API (free tier)
- **Styling**: Custom CSS with glassmorphism effects
- **State Management**: React hooks (useState, useEffect, useContext)
- **Authentication**: Custom authentication system
- **Build Tool**: Vite for fast development and optimized builds

## 📁 Project Structure

```
src/
├── components/
│   ├── AddCardModal/          # Modal for adding new coffee shops
│   ├── App/                   # Main application component
│   ├── AuthModal/             # Authentication modal
│   ├── CoffeeCard/            # Coffee shop card component
│   ├── CoffeeShopModal/       # Detailed coffee shop view
│   ├── FavoritesPage/         # User favorites page
│   ├── Header/                # Navigation header
│   ├── MapView/               # Interactive map component
│   └── SearchBar/             # Search functionality
├── utils/
│   └── mapApi.js              # API utilities for geocoding
└── assets/                    # Images and static files
```

## 🎯 Usage

### Adding a Coffee Shop

1. Click the "+" button on the map (requires login)
2. Enter the coffee shop details:
   - Name and location (with autocomplete)
   - Rating (1-5 coffee mugs)
   - Personal review
   - Optional image URL
3. Your coffee shop will appear on the map and in your collection

### Managing Your Collection

- **View Favorites**: Access your saved coffee shops in the favorites page
- **Delete Cards**: Click "Delete" on coffee shops you've added
- **Search & Filter**: Use the search bar to find specific shops

### Exploring Coffee Shops

- Browse the interactive map to discover new locations
- Click on markers to view detailed information
- Read reviews and ratings from other users

## 🗺️ API Integration

- **Mapbox**: Interactive maps and location services
- **Nominatim**: Free geocoding service for address lookup
- **Local Storage**: Persistent data storage for user preferences

## 🎨 Design Philosophy

Brewsky embraces a warm, coffee-inspired design with:

- Earth tones and coffee-themed colors
- Smooth glassmorphism effects
- Intuitive user interactions
- Mobile-first responsive design

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Acknowledgments

- Mapbox for excellent mapping services
- OpenStreetMap contributors for geocoding data
- Coffee enthusiasts everywhere who inspired this project

**Happy Coffee Hunting!** ☕✨
