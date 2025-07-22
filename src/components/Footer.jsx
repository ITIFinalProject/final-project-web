import { IoLogoGooglePlaystore, IoLogoApple } from "react-icons/io5";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="event-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Company Info</h6>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Help</h6>
              <ul>
                <li>
                  <a href="#">Account Support</a>
                </li>
                <li>
                  <a href="#">Listing Events</a>
                </li>
                <li>
                  <a href="#">Event Ticketing</a>
                </li>
                <li>
                  <a href="#">Ticket Purchase Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Categories</h6>
              <ul>
                <li>
                  <a href="#">Concerts & Gigs</a>
                </li>
                <li>
                  <a href="#">Festivals & Lifestyle</a>
                </li>
                <li>
                  <a href="#">Business & Networking</a>
                </li>
                <li>
                  <a href="#">Food & Drinks</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Follow Us</h6>
              <ul>
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Youtube</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-8 mb-4">
            <div className="footer-section">
              <h6>Download The App</h6>
              <a href="#" className="app-download">
                <div className="app-icon">
                  <IoLogoGooglePlaystore />
                </div>
                <div className="app-text">
                  <div className="small-text">Get it on</div>
                  <div className="main-text">Google Play</div>
                </div>
              </a>
              <a href="#" className="app-download">
                <div className="app-icon">
                  <IoLogoApple />
                </div>
                <div className="app-text">
                  <div className="small-text">Download on the</div>
                  <div className="main-text">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Eventify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
