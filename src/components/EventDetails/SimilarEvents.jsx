import { IoPricetag } from "react-icons/io5";

const SimilarEvents = () => {
  const events = [
    {
      id: 1,
      title: "Lakeside Camping at Pawna",
      date: "NOV 25-26",
      location: "Adventure Club · Explore the Unexplored",
      price: "FREE",
      image:
        "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Travel & Adventure",
    },
    {
      id: 2,
      title: "Project Earth Exhibition - Christmas and Party Edit",
      date: "DEC 16",
      location: "World Trade Centre, Mumbai",
      price: "FREE",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Culture & Arts",
    },
    {
      id: 3,
      title: "Meet the Royal College of Art in Mumbai 2023",
      date: "DEC 02",
      location: "Sofitel Mumbai BKC, Mumbai",
      price: "FREE",
      image:
        "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Education",
    },
  ];

  return (
    <div className="similar-events-section">
      <div className="container">
        <h3 className="section-title">Other events you may like</h3>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="other-event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-category">{event.category}</div>
              </div>
              <div className="event-info">
                <div className="event-date">{event.date}</div>
                <h4 className="event-title-card">{event.title}</h4>
                <p className="event-location">{event.location}</p>
                <div className="event-price">
                  <IoPricetag />
                  <span>{event.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarEvents;
