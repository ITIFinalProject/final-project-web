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

        // Format the date and time for input fields
        let formattedStartDate = "";
        let formattedStartTime = "";
        let formattedEndTime = "";

        // Handle startDate (could be 'startDate' or 'date')
        const dateField = event.startDate || event.date;
        if (dateField) {
          try {
            const date = dateField.toDate
              ? dateField.toDate()
              : new Date(dateField);

            // Check if the date is valid
            if (!isNaN(date.getTime())) {
              formattedStartDate = date.toISOString().split("T")[0];
            }
          } catch (error) {
            console.error("Error parsing start date:", error);
          }
        }

        // Handle startTime and endTime
        if (event.startTime) {
          try {
            const time = event.startTime.toDate
              ? event.startTime.toDate()
              : new Date(event.startTime);

            // Check if the time is valid
            if (!isNaN(time.getTime())) {
              formattedStartTime = time
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
            }
          } catch (error) {
            console.error("Error parsing start time:", error);
          }
        } else if (
          event.time &&
          typeof event.time === "string" &&
          event.time.includes(" - ")
        ) {
          // Handle legacy format "HH:MM - HH:MM"
          const [start, end] = event.time.split(" - ");
          formattedStartTime = start;
          formattedEndTime = end;
        }

        if (event.endTime) {
          try {
            const time = event.endTime.toDate
              ? event.endTime.toDate()
              : new Date(event.endTime);

            // Check if the time is valid
            if (!isNaN(time.getTime())) {
              formattedEndTime = time
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5);
            }
          } catch (error) {
            console.error("Error parsing end time:", error);
          }
        }

        setEventData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          startDate: formattedStartDate,
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

      // Prepare the updated data
      const updatedData = {
        ...eventData,
        capacity: eventData.capacity ? parseInt(eventData.capacity) : null,
      };

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
