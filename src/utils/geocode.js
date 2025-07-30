export const getAddressFromCoords = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'eventify (hagar28gamal@gmail.com)',
      },
    });
    const data = await res.json();
    return data.display_name || 'Unknown address';
  } catch (err) {
    console.error('Geocoding failed', err);
    return null;
  }
};



