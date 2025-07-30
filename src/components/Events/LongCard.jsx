import React from "react";
import { IoStar, IoLocationSharp, IoPeopleSharp } from "react-icons/io5";

const LongCard = ({ event }) => {
    const getDateDisplay = (dateStr) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const date = new Date(dateStr);
        return {
            month: months[date.getMonth()],
            day: date.getDate().toString().padStart(2, "0"),
        };
    };

    const dateDisplay = getDateDisplay(event.date);

    return (
        <div className="long-card">
            <div className="image-section">
                <img src={event.bannerUrl} alt={event.title}/>
                <div className="date-badge">
                    <div className="month">{dateDisplay.month}</div>
                    <div className="day">{dateDisplay.day}</div>
                </div>
                <button className="star-button">
                    <IoStar className="star-icon" />
                </button>
            </div>

            <div className="details-section">
                <h3 className="title">{event.title}</h3>
                <div className="location">
                    <IoLocationSharp className="location-icon" />
                    <span>{event.location}</span>
                </div>
                <div className="time">{event.time}</div>
                    <div className="interested">
                        <IoPeopleSharp className="people-icon" />
                        <span>{event.interested} interested</span>
                    </div>
            </div>
        </div>
    );
};

export default LongCard;
