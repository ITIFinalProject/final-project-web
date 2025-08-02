import { IoCalendar, IoTime, IoPricetag, IoTicket } from "react-icons/io5";
import HostSection from "./HostSection";

const DateTimeSection = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    try {
      let dateToFormat;

      // Handle date range formats like "31-07-2025 _ 02-08-2025"
      if (typeof dateString === "string" && dateString.includes(" _ ")) {
        // For event details, we can show the full range
        const [startDate, endDate] = dateString
          .split(" _ ")
          .map((d) => d.trim());

        // Format both dates
        const formatSingleDate = (dateStr) => {
          let date;
          if (dateStr.seconds) {
            date = new Date(dateStr.seconds * 1000);
          } else {
            // Handle different date formats
            if (dateStr.includes("-") && dateStr.split("-").length === 3) {
              const parts = dateStr.split("-").map((num) => parseInt(num, 10));

              // Check if it's DD-MM-YYYY (day > 12 or year < 1000) or YYYY-MM-DD format
              if (parts[0] > 31 || parts[0] > 1900) {
                // YYYY-MM-DD format (from web form)
                const [year, month, day] = parts;
                date = new Date(year, month - 1, day);
              } else {
                // DD-MM-YYYY format (from mobile app)
                const [day, month, year] = parts;
                date = new Date(year, month - 1, day);
              }
            } else {
              date = new Date(dateStr);
            }
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
        // Handle different date formats
        if (
          typeof dateToFormat === "string" &&
          dateToFormat.includes("-") &&
          dateToFormat.split("-").length === 3
        ) {
          const parts = dateToFormat.split("-").map((num) => parseInt(num, 10));

          // Check if it's DD-MM-YYYY (day > 12 or year < 1000) or YYYY-MM-DD format
          if (parts[0] > 31 || parts[0] > 1900) {
            // YYYY-MM-DD format (from web form)
            const [year, month, day] = parts;
            date = new Date(year, month - 1, day);
          } else {
            // DD-MM-YYYY format (from mobile app)
            const [day, month, year] = parts;
            date = new Date(year, month - 1, day);
          }
        } else {
          date = new Date(dateToFormat);
        }
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
                {formatTime(event?.startTime || event?.time)}
                {event?.endTime && ` - ${formatTime(event?.endTime)}`}
              </span>
            </div>
          </div>
          <div className="col-lg-4">
            <HostSection event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
