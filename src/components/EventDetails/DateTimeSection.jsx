import { IoCalendar, IoTime, IoPricetag, IoTicket } from "react-icons/io5";
import HostSection from "./HostSection";

const DateTimeSection = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    try {
      let dateToFormat;

      // Handle date range formats like "03/08/2025 - 06/08/2025" or "2025-09-13 - 2025-11-28"
      if (typeof dateString === "string" && dateString.includes(" - ")) {
        // For event details, we can show the full range
        const [startDate, endDate] = dateString
          .split(" - ")
          .map((d) => d.trim());

        // Format both dates
        const formatSingleDate = (dateStr) => {
          let date;
          if (dateStr.seconds) {
            date = new Date(dateStr.seconds * 1000);
          } else {
            date = new Date(dateStr);
          }
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        const formattedStart = formatSingleDate(startDate);
        const formattedEnd = formatSingleDate(endDate);

        // If it's the same date, show only once
        if (startDate === endDate) {
          return formattedStart;
        }

        return `${formattedStart} - ${formattedEnd}`;
      } else {
        dateToFormat = dateString;
      }

      // Handle Firestore timestamp or date string
      let date;
      if (dateToFormat.seconds) {
        // Firestore timestamp
        date = new Date(dateToFormat.seconds * 1000);
      } else {
        date = new Date(dateToFormat);
      }

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time TBD";
    try {
      // If it's already formatted time, return as is
      if (timeString.includes("AM") || timeString.includes("PM")) {
        return timeString;
      }
      // If it's a time in HH:MM format, convert to 12-hour format
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString || "Time TBD";
    }
  };

  const handleAddToCalendar = () => {
    // Create a calendar event URL (Google Calendar)
    const title = encodeURIComponent(event?.title || "Event");
    const details = encodeURIComponent(event?.description || "");
    const location = encodeURIComponent(event?.location || "");

    let startDate = "";
    if (event?.startDate || event?.date) {
      try {
        let date;
        const dateField = event?.startDate || event?.date;
        if (dateField.seconds) {
          date = new Date(dateField.seconds * 1000);
        } else {
          date = new Date(dateField);
        }
        startDate = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      } catch (error) {
        console.error("Error formatting date for calendar:", error);
      }
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${startDate}&details=${details}&location=${location}`;
    window.open(calendarUrl, "_blank");
  };

  return (
    <div className="det-datetime-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="section-title">Date and Time</h3>
            <div className="datetime-info">
              <IoCalendar />
              <span>{formatDate(event?.startDate || event?.date)}</span>
            </div>
            <div className="datetime-info">
              <IoTime />
              <span>
                {formatTime(event?.startTime)}
                {event?.endTime && ` - ${formatTime(event?.endTime)}`}
              </span>
            </div>
            <button className="add-calendar-btn" onClick={handleAddToCalendar}>
              + Add to Calendar
            </button>
          </div>
          {/* <div className="col-lg-4">
            <div className="ticket-info-card">
              <h5>Ticket Information</h5>
              <div className="ticket-price">
                <IoPricetag />
                <span>
                  {event?.price ? `Ticket: ${event.price}` : "Free Event"}
                </span>
              </div>
              <button className="buy-tickets-btn">
                <IoTicket />
                {event?.price ? "Buy Tickets" : "Register"}
              </button>
            </div>
          </div> */}
          <div className="col-lg-4">
            <HostSection event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
