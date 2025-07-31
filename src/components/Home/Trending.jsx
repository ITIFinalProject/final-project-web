import {useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EventCard from "../EventCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventSlice"; 


const Trending = () => {
  const dispatch = useDispatch();
  const { data: events, loading } = useSelector((state) => state.events);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!events.length && currentUser?.uid) {
      dispatch(fetchEvents(currentUser.uid));
    }
  }, [dispatch, currentUser, events.length]);

  const trendingEvents = events.slice(0, 6);
  return (
    <section className="trending-events">
      <h2>Trending Events</h2>
      <br />

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
        }}
      >
        {trendingEvents.map((event) => (
          <SwiperSlide key={event.id}>
            <EventCard event={event} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom controls OUTSIDE the swiper */}
      <div className="custom-controls">
        <div className="custom-prev"> Prev</div>
        <div className="custom-pagination"></div>
        <div className="custom-next">Next </div>
      </div>
    </section>
  );
};

export default Trending;