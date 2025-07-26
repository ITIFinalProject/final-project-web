import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
// import EventDetails from "./pages/EventDetails";
import EventHeader from "./components/EventHeader";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot/Chatbot";
import InterestedEvents from "./pages/InterestedEvents";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Album from "./pages/Album";
import CreateEvent from "./pages/CreateEvent";
import AuthInitializer from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <EventHeader />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/Events" element={<Events />} />
            {/* <Route path="/EventDetails" element={<EventDetails />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route
              path="/InterestedEvents"
              element={
                <ProtectedRoute>
                  <InterestedEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Album"
              element={
                <ProtectedRoute>
                  <Album />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CreateEvent"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
          <Chatbot />
        </Router>
      </AuthInitializer>
    </Provider>
  );
}
export default App;
