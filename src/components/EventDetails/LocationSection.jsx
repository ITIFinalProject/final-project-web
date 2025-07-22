import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

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

const LocationSection = () => {
  // Coordinates for Bal Gandharva Rang Mandir, Bandra West, Mumbai
  const venuePosition = [19.0596, 72.8295];
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(venuePosition);

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
          // Center map between venue and user location
          setMapCenter(userLocation);
        },
        (error) => {
          console.log("Error getting location:", error);
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
            <div>
              Bal Gandharva Rang Mandir, Near Junction Of 24th & 32nd Road &
              Patwardhan Park Off Linking Road, Bandra West, Mumbai, India
            </div>
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
                  <strong>Bal Gandharva Rang Mandir</strong>
                  <br />
                  Event Venue
                  <br />
                  Bandra West, Mumbai
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
