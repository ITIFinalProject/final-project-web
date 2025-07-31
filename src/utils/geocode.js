export const getAddressFromCoords = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "eventify (hagar28gamal@gmail.com)",
      },
    });
    const data = await res.json();
    return data.display_name || "Unknown address";
  } catch (err) {
    console.error("Geocoding failed", err);
    return null;
  }
};

export const getCoordsFromAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "eventify (hagar28gamal@gmail.com)",
      },
    });
    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (err) {
    console.error("Forward geocoding failed", err);
    return null;
  }
};
