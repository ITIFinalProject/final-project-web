
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const events = useSelector((state) => state.events.data);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(term)
    );
  });

  return (
    <section className="hero">
      <h1>Don’t miss out!</h1>
      <h5>
        Explore the <span className="highlight">vibrant events</span> happening locally and globally.
      </h5>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Events, Categories, Locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Show search results */}
        {searchTerm && (
          <div className="search-results">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <Link to={`/event/${event.id}`} key={event.id}>
                  <div>
                    <img src={event.bannerUrl} alt="" />
                    <strong>{event.title}</strong> – {event.date}
                  </div>
                </Link>
              ))
            ) : (
              <p>No matching events.</p>
            )}
          </div>
        )}
      </div>

    </section>
  );
};

export default Hero;
