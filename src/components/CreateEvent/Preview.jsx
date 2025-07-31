import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
const Preview = ({ eventData, onBack, latlng }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const {
    title,
    location,
    date,
    time,
    type,
    bannerUrl,
    category,
    capacity,
    description,
    hostName,
    hostId,
    guests,
  } = eventData;

  const { lat, lng } = latlng || [30.0444, 31.2357];

  const onPublish = async () => {
    try {
      // First, add the event to Firestore
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
      });

      // Create the event data with the generated ID
      const eventWithId = {
        ...eventData,
        id: docRef.id,
      };

      // If it's a private event with guests, create invitations
      if (
        eventData.type === "Private" &&
        eventData.guests &&
        eventData.guests.length > 0
      ) {
        try {
          await notificationService.createEventInvitations(eventWithId);
          console.log("Invitations sent successfully");
        } catch (invitationError) {
          console.error("Error sending invitations:", invitationError);
          // Don't fail the whole process if invitations fail
        }
      }

      // alert("Event published!");
      //toast
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong while publishing the event.");
    }
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2 className="preview-title">{title}</h2>
        <p className="preview-sub">{location || "Location not set"}</p>
        {/* <p className="preview-sub">{`${startTime} - ${endTime}`}</p> */}

        <p>Nearly there! Check everything's correct.</p>
      </div>

      <div className="event-preview-box">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Event Banner"
            className="event-image-placeholder"
          />
        ) : (
          <div className="event-image-placeholder">No Banner</div>
        )}

        <div className="event-details">
          <h3 className="event-title">{title}</h3>

          <div className="event-meta">
            <div className="meta-block">
              <h4>Date and Time</h4>

              <p>
                <FaCalendarAlt className="icon" /> {date}
              </p>
              <p>
                <FaClock className="icon" /> {time}
              </p>

              {/* <a href="#" className="add-calendar">+ Add to Calendar</a> */}
            </div>

            <div className="meta-block">
              <h4>Event Main Information</h4>
              <p>
                <FaTicketAlt /> Type: {type}{" "}
              </p>
              <p> Capacity: {capacity}</p>
              <p> Category: {category}</p>
            </div>
          </div>

          <div className="create-location">
            <h4>Location</h4>
            <p>
              <FaMapMarkerAlt className="icon" />{" "}
              {location || "Address unavailable"}
            </p>
            <div className="map-placeholder">
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: "200px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          </div>

          <div className="host-section">
            <h4>Hosted by</h4>
            <div className="host-info">
              <div className="host-avatar">
                {hostName?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="host-meta">
                <p className="host-name">{hostName || "Unknown Host"}</p>
                <p>{user.email || "Unknown Host"}</p>
                {/* <div className="host-actions">
                  <button className="btn-outline">Contact</button>
                  <button className="btn-filled">+ Follow</button>
                </div> */}
              </div>
            </div>
          </div>

          {guests?.length > 0 && (
            <div className="guest-list">
              <h4>Guests</h4>
              <ul>
                {guests.map((guest, index) => (
                  <li key={index}>{guest.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="description">
            <h4>Event Description</h4>
            <p>{description || "No description provided."}</p>
          </div>
        </div>
      </div>

      <div className="preview-actions">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button className="save-btn" onClick={onPublish}>
          Publish Event
        </button>
      </div>
    </div>
  );
};

export default Preview;
