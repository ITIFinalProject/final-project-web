import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import EventCard from "../EventCard"; // or your own card

const Trending = () => {
  const events = [
    {
      id: 1,
      title: "Sound Of Christmas 2023",
      date: "2023-12-02",
      time: "6:30 PM - 10:30 PM",
      location: "Renaissance Mumbai, Bombay",
      interested: 52,
      image: `https://picsum.photos/300/200?random=1`,
      category: "Music",
    },
    {
      id: 2,
      title: "Cricket Business Meetup",
      date: "2023-12-08",
      time: "6:30 PM - 9:30 PM",
      location: "Bombay Gymkhana, Mumbai",
      interested: 399,
      image: `https://picsum.photos/300/200?random=2`,
      category: "Business",
    },
    {
      id: 3,
      title: "Valentine's Day Sail on a Yacht in Mumbai",
      date: "2024-02-14",
      time: "7:00 AM - 9 PM",
      location: "Mumbai",
      interested: 596,
      image: `https://picsum.photos/300/200?random=3`,
      category: "Romance",
    },
    {
      id: 4,
      title: "Easy book folding: Christmas edition",
      date: "2023-12-12",
      time: "3:00 PM - 5:00 PM",
      location: "Online",
      interested: 51,
      image: `https://picsum.photos/300/200?random=4`,
      category: "Workshop",
    },
    {
      id: 5,
      title: "Voices from the Rome Synod: An evening with Austen Ivereigh",
      date: "2023-12-14",
      time: "6:30 PM - 8:00 PM",
      location: "Online",
      interested: 74,
      image: `https://picsum.photos/300/200?random=5`,
      category: "Religious",
    },
    {
      id: 6,
      title: "FRIENDS OF THE METAVERSE: Season of Innovation 2023",
      date: "2023-12-07",
      time: "6:00 AM - 3:30 PM",
      location: "Online",
      interested: 93,
      image: `https://picsum.photos/300/200?random=6`,
      category: "Technology",
    },
    {
      id: 7,
      title:
        "Startup Talks: Innovative event for founders & Startup Enthusiasts",
      date: "2023-11-24",
      time: "5:00 PM - 8 PM",
      location: "Coworking Space, Mumbai",
      interested: 45,
      image: `https://picsum.photos/300/200?random=7`,
      category: "Startup",
    },
    {
      id: 8,
      title: "Mindtech India Tour - VR Day",
      date: "2023-11-25",
      time: "10:00 AM - 6:00 PM",
      location: "Venue",
      interested: 70,
      price: "₹799 - ₹2499",
      image: `https://picsum.photos/300/200?random=8`,
      category: "Technology",
    },
    {
      id: 9,
      title: "Pet Fed Delhi 2023",
      date: "2023-11-25",
      time: "10:00 AM - 8:00 PM",
      location: "Venue",
      interested: 15,
      price: "₹200 - ₹500",
      image: `https://picsum.photos/300/200?random=9`,
      category: "Pets",
    },
  ];

  return (
    <section className="trending-events">
      <h2>Trending Events</h2>
<br/>

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
        {events.map((event) => (
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