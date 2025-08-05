# Mapbox Setup Instructions

## 🗺️ Getting Your Mapbox API Key

1. **Sign up for Mapbox (Free)**

   - Go to https://www.mapbox.com/
   - Click "Get started for free"
   - Create your account

2. **Get Your Access Token**

   - After signing up, go to your Account page
   - Find your "Default public token"
   - Copy this token

3. **Add the Token to Your App**
   - Open `src/components/MapView/MapView.jsx`
   - Replace `'YOUR_MAPBOX_ACCESS_TOKEN'` with your actual token
   - Example: `mapboxgl.accessToken = 'pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsb...';`

## 🚀 Features Added

- **Interactive Map**: Shows coffee shops near your location
- **Real Coffee Shop Data**: Uses Mapbox Places API to find actual coffee shops
- **Geolocation**: Automatically centers map on your location
- **Coffee Shop Markers**: Click on ☕ markers to view shop details
- **Industrial Theme**: Matches your app's color scheme
- **Mobile Responsive**: Optimized for phone screens

## 📱 Usage

1. The map will ask for location permission
2. Coffee shop markers (☕) will appear on the map
3. Click any marker to see shop details
4. Click "View Details" in the popup to open the coffee shop modal

## 🔧 Customization

You can customize:

- Map style in `MapView.jsx` (change `mapbox://styles/mapbox/light-v11`)
- Search radius and number of results
- Marker styling in `MapView.css`
- Popup content and styling

## 📊 API Limits

Mapbox free tier includes:

- 50,000 map loads per month
- 100,000 geocoding requests per month
- Perfect for a coffee shop finder app!
