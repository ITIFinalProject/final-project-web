import { useState, useEffect } from "react";
import { eventService } from "../services/eventService";
import { uploadEventImage } from "../services/eventImageService";

export const useEditEvent = (eventId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);
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
  });

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
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  };
};
