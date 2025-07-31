import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { getCoordsFromAddress } from "../../utils/geocode";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Default coordinates (Cairo, Egypt)
const DEFAULT_POSITION = [30.0444, 31.2357];

// Create a red marker icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Blue marker for current location
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationSection = ({ event }) => {
  const [venuePosition, setVenuePosition] = useState(DEFAULT_POSITION);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_POSITION);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Extract location coordinates from event data
  useEffect(() => {
    const setupLocation = async () => {
      if (
        event?.coordinates &&
        event.coordinates.lat &&
        event.coordinates.lng
      ) {
        // Use provided coordinates
        const coords = [event.coordinates.lat, event.coordinates.lng];
        setVenuePosition(coords);
        setMapCenter(coords);
      } else if (event?.location) {
        // Geocode the location string
        setIsLoadingLocation(true);
        try {
          const coords = await getCoordsFromAddress(event.location);
          if (coords) {
            const position = [coords.lat, coords.lng];
            setVenuePosition(position);
            setMapCenter(position);
          } else {
            // Fallback to default if geocoding fails
            console.log("Geocoding failed, using default position");
            setVenuePosition(DEFAULT_POSITION);
            setMapCenter(DEFAULT_POSITION);
          }
        } catch (error) {
          console.error("Error geocoding location:", error);
          setVenuePosition(DEFAULT_POSITION);
          setMapCenter(DEFAULT_POSITION);
        } finally {
          setIsLoadingLocation(false);
        }
      } else {
        // No location data available
        setVenuePosition(DEFAULT_POSITION);
        setMapCenter(DEFAULT_POSITION);
      }
    };

    if (event) {
      setupLocation();
    }
  }, [event]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCurrentLocation(userLocation);
        },
        () => {
          // Keep venue as center if location access is denied
        }
      );
    }
  }, []);

  return (
    <div className="location-section">
      <div className="container">
        <h3 className="section-title">Location</h3>
        <div className="location-info">
          <IoLocationSharp />
          <div className="location-text">
            <div>{event?.location || "Location TBD"}</div>
            {isLoadingLocation && (
              <small className="text-muted">Loading map location...</small>
            )}
          </div>
        </div>
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "280px", width: "100%", borderRadius: "15px" }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Red marker for the event venue */}
            <Marker position={venuePosition} icon={redIcon}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{event?.title || "Event Venue"}</strong>
                  <br />
                  Event Location
                  <br />
                  {event?.location || "Location TBD"}
                </div>
              </Popup>
            </Marker>
            {/* Blue marker for current location */}
            {currentLocation && (
              <Marker position={currentLocation} icon={blueIcon}>
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <strong>Your Location</strong>
                    <br />
                    Current Position
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
