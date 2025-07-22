// import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import EventHeader from "./components/EventHeader";
import Footer from "./components/Footer";
import InterestedEvents from "./pages/InterestedEvents";
import "./styles/App.css";

function App() {
  return (
    <>
      <EventHeader />
      <div className="App">
        {/* <SignUp /> */}
        {/* <EventDetails /> */}
        <InterestedEvents />
      </div>
      <Footer />
    </>
  );
}
export default App;
