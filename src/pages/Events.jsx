import { useEffect } from 'react';
import '../styles/events.css'
import LongCard from '../components/Events/LongCard'
import Filter from '../components/Events/Filter'
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice"

  ;
const Events = () => {
  const dispatch = useDispatch();
  const { data: events, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);



  return (
    <section className='events-page'>
      <Filter />
      <div className="all-events">
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>Error loading events: {error}</p>
        ) : events.length > 0 ? (
          events.map((event) => <LongCard event={event} key={event.id} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </section>
  )
}

export default Events