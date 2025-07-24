import '../styles/events.css'
import LongCard from '../components/Events/LongCard'
import Filter from '../components/Events/Filter'
const Events = () => {
const events = [
  {
    id: 1,
    title: "Sound Of Christmas 2023",
    date: "2023-12-02",
    time: "6:30 PM - 10:30 PM",
    location: "Renaissance Mumbai, Bombay",
    interested: 52,
    image: "https://picsum.photos/seed/event1/400/250",
    category: "Music",
  },
  {
    id: 2,
    title: "Cricket Business Meetup",
    date: "2023-12-08",
    time: "6:30 PM - 9:30 PM",
    location: "Bombay Gymkhana, Mumbai",
    interested: 399,
    image: "https://picsum.photos/seed/event2/400/250",
    category: "Business",
  },
  {
    id: 3,
    title: "Valentine's Day Sail on a Yacht in Mumbai",
    date: "2024-02-14",
    time: "7:00 AM - 9 PM",
    location: "Mumbai",
    interested: 596,
    image: "https://picsum.photos/seed/event3/400/250",
    category: "Romance",
  },
  {
    id: 4,
    title: "Easy book folding: Christmas edition",
    date: "2023-12-12",
    time: "3:00 PM - 5:00 PM",
    location: "Online",
    interested: 51,
    image: "https://picsum.photos/seed/event4/400/250",
    category: "Workshop",
  },
  {
    id: 5,
    title: "Voices from the Rome Synod: An evening with Austen Ivereigh",
    date: "2023-12-14",
    time: "6:30 PM - 8:00 PM",
    location: "Online",
    interested: 74,
    image: "https://picsum.photos/seed/event5/400/250",
    category: "Religious",
  }
];


  return (
    <section className='events-page'>
      <Filter />
      <div className="all-events">
        {events.map((event) => (
          <LongCard event={event} key={event.id}/>
        ))}
      </div>
    </section>
  )
}

export default Events