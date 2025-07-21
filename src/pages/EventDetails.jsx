import Footer from "../components/Footer";
import HeroBanner from "../components/EventDetails/HeroBanner";

import EventTitleSection from "../components/EventDetails/EventTitleSection";
import DateTimeSection from "../components/EventDetails/DateTimeSection";
import LocationSection from "../components/EventDetails/LocationSection";
import HostSection from "../components/EventDetails/HostSection";
import EventDescription from "../components/EventDetails/EventDescription";
import TagsSection from "../components/EventDetails/TagsSection";
import SimilarEvents from "../components/EventDetails/SimilarEvents";

import "../styles/EventDetails.css";

const EventDetails = () => {
  return (
    <div>
      <HeroBanner />
      <EventTitleSection />
      <DateTimeSection />
      <LocationSection />
      <HostSection />
      <EventDescription />
      <TagsSection />
      <SimilarEvents />
    </div>
  );
};

export default EventDetails;
