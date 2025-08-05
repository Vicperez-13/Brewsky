import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const searchLocation = async (query) => {
  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCard = async (cardData) => {
  try {
    const newCard = {
      id: Date.now(),
      ...cardData,
      dateAdded: new Date().toISOString(),
    };

    return newCard;
  } catch (error) {
    throw error;
  }
};
