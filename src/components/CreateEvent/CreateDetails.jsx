import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { getAddressFromCoords } from "../../utils/geocode";

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
};

const CreateDetails = ({ onContinue, latlng }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    // startDate: '',
    startTime: "",
    endTime: "",
    // hostName: '',
    capacity: "",
    // location: '',
    // hostId: '',
    type: "",
  });

  // {
  //   title: "Event Title",
  //   description: "Optional description",
  //   date: "2025-08-01",
  //   time: "14:00",
  //   location: "Cairo",
  //   category: '',
  //   capacity: 10,
  //   type: "Private",
  //   hostName: "Hagar Gamal",        // From logged-in user
  //   hostId: "currentUser.uid",      // (Recommended for secure querying)
  //   guests: [                       // Only if Private
  //     { id: "abc123", name: "Jane Doe", email: "jane@example.com" },
  //     { id: "xyz456", name: "Ahmed Ali", email: "ahmed@example.com" }
  //   ],
  // }

  const [location, setLocation] = useState(null);

  const user = useSelector((state) => state.auth.currentUser);
  const [allUsers, setAllUsers] = useState([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);

  // Automatically assign host name from logged-in user
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, hostName: user.name }));
    }
  }, [user, setFormData]);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.id !== user?.uid); // exclude self
      setAllUsers(users);
    };
    fetchUsers();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestSearch = (e) => {
    const input = e.target.value.toLowerCase();
    setGuestSearch(input);
    const filtered = allUsers.filter((u) =>
      u.name?.toLowerCase().includes(input)
    );
    setFilteredGuests(filtered);
  };

  const handleAddGuest = (guest) => {
    if (!formData.guests?.find((g) => g.id === guest.id)) {
      if ((formData.guests?.length || 0) < formData.capacity) {
        setFormData((prev) => ({
          ...prev,
          guests: [...(prev.guests || []), guest],
        }));
        setGuestSearch("");
        setFilteredGuests([]);
      } else {
        alert("You've reached the maximum capacity for guests.");
      }
    }
  };

  const handleRemoveGuest = (id) => {
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location on the map.");
      return;
    }
    latlng({ lat: location.lat, lng: location.lng });

    const address = await getAddressFromCoords(location.lat, location.lng);
    if (!address) {
      alert("Failed to get address from coordinates.");
      return;
    }

    const preparedData = {
      ...formData,
      // hostId: user.uid,
      // hostName: user.name,
      location: address,
      startDate: formData.startDate, // Keep consistent naming
      startTime: formData.startTime, // Keep separate
      endTime: formData.endTime, // Keep separate
      // Remove the old 'date' and 'time' fields to avoid confusion
    };

    // If public, guests field should be removed
    if (formData.type !== "Private") {
      delete preparedData.guests;
    }

    // ✅ Just pass data to parent to go to next step
    onContinue(preparedData);
  };

  const categories = useSelector((state) => state.category.list);

  return (
    <div className="create-details">
      <form className="details-form" onSubmit={handleSubmit}>
        <section>
          <h3>Event Details</h3>
          <label>
            Event Title <span>*</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Event Category <span>*</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Please select one</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
          </label>

          <label>
            Type <span>*</span>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Please select</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </label>

          {formData.type === "Private" && (
            <div className="guest-selector">
              <label>
                Invite Guests (up to {formData.capacity})
                <input
                  type="text"
                  placeholder="Search users..."
                  value={guestSearch}
                  onChange={handleGuestSearch}
                />
              </label>
              {filteredGuests.length > 0 && (
                <ul className="guest-suggestions">
                  {filteredGuests.map((user) => (
                    <li key={user.id} onClick={() => handleAddGuest(user)}>
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
              <div className="selected-guests">
                {formData.guests?.map((guest) => (
                  <div key={guest.id} className="guest-chip">
                    {guest.name}
                    <button onClick={() => handleRemoveGuest(guest.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <h3>Date & Time</h3>
          <label>
            Start Date
            <input type="date" name="startDate" onChange={handleChange} />
          </label>
          <label>
            Start Time
            <input type="time" name="startTime" onChange={handleChange} />
          </label>
          <label>
            End Time
            <input type="time" name="endTime" onChange={handleChange} />
          </label>
        </section>

        <section>
          <h3>Location (Click map to select)</h3>
          <MapContainer
            center={[30.0444, 31.2357]}
            zoom={13}
            style={{ height: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setLocation} />
            {location && <Marker position={location} />}
          </MapContainer>
        </section>

        <section>
          <h3>Additional Information</h3>
          {/* <label>
            Host Name
            <input type="text" name="hostName" value={formData.hostName} onChange={handleChange} />
          </label> */}

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
        </section>

        <button type="submit" className="save-btn">
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default CreateDetails;
