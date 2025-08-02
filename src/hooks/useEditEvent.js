import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import { uploadEventImage } from "../services/eventImageService";
import { notificationService } from "../services/notificationService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const useEditEvent = (eventId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    type: "",
    bannerUrl: "",
    category: "",
    capacity: "",
    guests: [],
  });

  // Fetch all users for guest invitations
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.id !== currentUser?.uid); // exclude self
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const event = await eventService.getEventById(eventId);

        // Check if current user is the owner
        if (event.hostId !== currentUser?.uid) {
          setError("You don't have permission to edit this event");
          return;
        }

        // Parse Firebase date and time formats back to separate fields for UI
        let formattedStartDate = "";
        let formattedEndDate = "";
        let formattedStartTime = "";
        let formattedEndTime = "";

        // Parse date field "2025-08-23 _ 2025-08-29" or "2025-08-23"
        if (event.date) {
          if (event.date.includes(" _ ")) {
            const [startDate, endDate] = event.date.split(" _ ");
            formattedStartDate = startDate.trim();
            formattedEndDate = endDate.trim();
          } else {
            formattedStartDate = event.date;
            formattedEndDate = event.date; // Same date for single-day events
          }
        }

        // Parse time field "16:05 - 23:00"
        if (event.time && event.time.includes(" - ")) {
          const [startTime, endTime] = event.time.split(" - ");
          formattedStartTime = startTime.trim();
          formattedEndTime = endTime.trim();
        }

        setEventData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          capacity: event.capacity || "",
          bannerUrl: event.bannerUrl || "",
          category: event.category || "",
          type: event.type || "",
          guests: event.guests || [],
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const result = await uploadEventImage(file, eventId || "temp");

      if (result.error) {
        alert(`Image upload failed: ${result.error}`);
        return;
      }

      setEventData((prev) => ({
        ...prev,
        bannerUrl: result.url,
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
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
    if (!eventData.guests?.find((g) => g.id === guest.id)) {
      if ((eventData.guests?.length || 0) < eventData.capacity) {
        setEventData((prev) => ({
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
    setEventData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  };

  const handleSubmit = async (navigate) => {
    try {
      setSaving(true);

      // Prepare the updated data to match Firebase schema exactly
      const updatedData = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        category: eventData.category,
        type: eventData.type,
        capacity: eventData.capacity,
        bannerUrl: eventData.bannerUrl,
        // Combine separate date fields into Firebase format
        date:
          eventData.endDate && eventData.endDate !== eventData.startDate
            ? `${eventData.startDate} _ ${eventData.endDate}`
            : eventData.startDate,
        // Combine separate time fields into Firebase format
        time: `${eventData.startTime} - ${eventData.endTime}`,
        // Include guests for private events
        guests: eventData.type === "Private" ? eventData.guests : [],
      };

      // Only include fields that are not empty/null
      Object.keys(updatedData).forEach((key) => {
        if (
          updatedData[key] === "" ||
          updatedData[key] === null ||
          updatedData[key] === undefined
        ) {
          delete updatedData[key];
        }
      });

      await eventService.updateEvent(eventId, updatedData);

      // If it's a private event with guests, create invitations for new guests
      if (
        updatedData.type === "Private" &&
        updatedData.guests &&
        updatedData.guests.length > 0
      ) {
        try {
          const eventWithId = {
            id: eventId,
            ...updatedData,
            hostId: currentUser.uid,
            hostName: currentUser.displayName,
          };
          await notificationService.createEventInvitations(eventWithId);
          console.log("Invitations sent successfully");
        } catch (invitationError) {
          console.error("Error sending invitations:", invitationError);
          // Don't fail the whole process if invitations fail
        }
      }

      alert("Event updated successfully!");
      navigate("/profile", { state: { activeSection: "my-events" } });
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    imageUploading,
    error,
    eventData,
    allUsers,
    guestSearch,
    filteredGuests,
    handleInputChange,
    handleImageUpload,
    handleGuestSearch,
    handleAddGuest,
    handleRemoveGuest,
    handleSubmit,
  };
};
