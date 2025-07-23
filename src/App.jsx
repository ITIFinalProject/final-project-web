
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import EventHeader from "./components/EventHeader";
import Footer from "./components/Footer";
import InterestedEvents from "./pages/InterestedEvents";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";  
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Router>
        <EventHeader />
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<Home />} />
          <Route path='/Events' element={<Events />} />
          <Route path='/EventDetails/:id' element={<EventDetails />} />
          <Route path='/InterestedEvents' element={<InterestedEvents />} />
          <Route path='/SignUp' element={<SignUp />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
export default App;

