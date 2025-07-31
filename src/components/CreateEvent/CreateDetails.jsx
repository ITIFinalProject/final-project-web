import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { getAddressFromCoords } from "../../utils/geocode";
/*suddenly after merge marker begin to not appear */
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { getAddressFromCoords } from "../../utils/geocode";

const LocationPicker = ({ setLocation, setErrors, errors }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);

      // Clear error if exists
      if (errors?.location) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.location;
          return newErrors;
        });
      }
    },
  });

  return null;
};

const CreateDetails = ({ onContinue, latlng }) => {
  const user = useSelector((state) => state.auth.currentUser);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    capacity: "",
    type: "",
  });

  const categories = useSelector((state) => state.category.list);
  const [allUsers, setAllUsers] = useState([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState({});

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

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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

    const newErrors = {};
    // Validate required fields
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.type) newErrors.type = "Event type is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (!location) newErrors.location = "Location must be selected on map";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    latlng({ lat: location.lat, lng: location.lng });
    const address = await getAddressFromCoords(location.lat, location.lng);
    if (!address) {
      alert("Failed to get address from coordinates.");
      return;
    }

    const preparedData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      capacity: formData.capacity,
      type: formData.type,
      hostId: user.uid,
      hostName: user.displayName,
      location: address,
      date:
        formData.startDate == formData.endDate
          ? formData.startDate
          : `${formData.startDate} - ${formData.endDate}`,
      time: `${formData.startTime} - ${formData.endTime} `,
      guests: formData.guests,
    };

    // If public, guests field should be removed
    if (formData.type !== "Private") {
      delete preparedData.guests;
    }

    // ✅ Just pass data to parent to go to next step
    onContinue(preparedData);
  };

  return (
    <div>
      <form className="details-form" onSubmit={handleSubmit}>
        {/* MARK:main
         */}
        <section>
          <h3>Event Details</h3>
          <label>
            Event Title <span>*</span>
          </label>
          {/* <br /> */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error-msg">{errors.title}</p>}

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
            {errors.category && <p className="error-msg">{errors.category}</p>}
          </label>
        </section>

        {/* MARK:type
         */}
        <section>
          <div>
            <label>
              Capacity <span>*</span>
            </label>
            {/* <br /> */}
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
            {errors.capacity && <p className="error-msg">{errors.capacity}</p>}
          </div>

          <div className="radio-group">
            <label>
              Type <span>*</span>&nbsp;
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Public"
                checked={formData.type === "Public"}
                onChange={handleChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Private"
                checked={formData.type === "Private"}
                onChange={handleChange}
              />
              Private
            </label>
            {errors.type && <p className="error-msg">{errors.type}</p>}
          </div>

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

        {/* MARK:time
         */}

        <section>
          <h3>Date & Time</h3>
          <div className="row-inputs">
            <div>
              <label>
                Start Date <span>*</span>
              </label>
              {/* <br /> */}
              <input type="date" name="startDate" onChange={handleChange} />
              {errors.startDate && (
                <p className="error-msg">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label>
                End Date <span>*</span>
              </label>
              {/* <br /> */}
              <input type="date" name="endDate" onChange={handleChange} />
              {errors.endDate && <p className="error-msg">{errors.endDate}</p>}
            </div>
          </div>
          <div className="row-inputs">
            <div>
              <label>
                Start Time <span>*</span>
              </label>
              {/* <br /> */}
              <input type="time" name="startTime" onChange={handleChange} />
              {errors.startTime && (
                <p className="error-msg">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label>
                End Time <span>*</span>
              </label>
              {/* <br /> */}
              <input type="time" name="endTime" onChange={handleChange} />
              {errors.endTime && <p className="error-msg">{errors.endTime}</p>}
            </div>
          </div>
        </section>

        {/* MARK:location
         */}
        <section>
          <h3>Location (Click map to select)</h3>
          <MapContainer
            center={[30.0444, 31.2357]}
            zoom={13}
            style={{ height: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              setLocation={setLocation}
              setErrors={setErrors}
              errors={errors}
            />
            {location && <Marker position={location} />}
          </MapContainer>
          {errors.location && <p className="error-msg">{errors.location}</p>}
        </section>

        <section>
          <h3>Additional Information</h3>
          <label>
            Description <span>*</span>
          </label>
          {/* <br /> */}
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="error-msg">{errors.description}</p>
          )}
        </section>

        <button type="submit" className="save-btn">
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default CreateDetails;
