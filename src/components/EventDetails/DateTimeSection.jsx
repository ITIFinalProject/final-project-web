import { IoCalendar, IoTime, IoPricetag, IoTicket } from 'react-icons/io5';

const DateTimeSection = () => {
  return (
    <div className="datetime-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="section-title">Date and Time</h3>
            <div className="datetime-info">
              <IoCalendar />
              <span>Saturday, 2 December 2023</span>
            </div>
            <div className="datetime-info">
              <IoTime />
              <span>6:30 PM - 9:30 PM</span>
            </div>
            <button className="add-calendar-btn">+ Add to Calendar</button>
          </div>
          <div className="col-lg-4">
            <div className="ticket-info-card">
              <h5>Ticket Information</h5>
              <div className="ticket-price">
                <IoPricetag />
                <span>Standard Ticket: ₹ 200 each</span>
              </div>
              <button className="buy-tickets-btn">
                <IoTicket /> Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
