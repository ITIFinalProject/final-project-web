import { IoLogoGooglePlaystore, IoLogoApple } from "react-icons/io5";
import "../styles/Footer.css";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  // const categories = useSelector((state) => state.category.list);
  const navigate = useNavigate();
  const handleClick = (category) => {
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };
  return (
    <footer className="event-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Company Info</h6>
              <ul>
                <li>
                  <Link to="#">About Us</Link>
                </li>
                <li>
                  <Link to="#">Contact Us</Link>
                </li>
                <li>
                  <Link to="#">Careers</Link>
                </li>
                <li>
                  <Link to="#">Press</Link>
                </li>
                <li>
                  <Link to="#">Terms of Service</Link>
                </li>
                <li>
                  <Link to="#">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Help</h6>
              <ul>
                <li>
                  <Link to="#">Account Support</Link>
                </li>
                <li>
                  <Link to="#">Listing Events</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Categories</h6>
              <ul>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Entertainment")}
                  >
                    Entertainment
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Educational & Business")}
                  >
                    Educational & Business
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Cultural & Arts")}
                  >
                    Cultural & Arts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Sports & Fitness")}
                  >
                    Sports & Fitness
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Technology & Innovation")}
                  >
                    Technology & Innovation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="category-link"
                    onClick={() => handleClick("Travel & Adventure")}
                  >
                    Travel & Adventure
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <div className="footer-section">
              <h6>Follow Us</h6>
              <ul>
                <li>
                  <Link to="#">Facebook</Link>
                </li>
                <li>
                  <Link to="#">Instagram</Link>
                </li>
                <li>
                  <Link to="#">Twitter</Link>
                </li>
                <li>
                  <Link to="#">Youtube</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-8 mb-4">
            <div className="footer-section">
              <h6>Download The App</h6>
              <Link to="#" className="app-download">
                <div className="app-icon">
                  <IoLogoGooglePlaystore />
                </div>
                <div className="app-text">
                  <div className="small-text">Get it on</div>
                  <div className="main-text">Google Play</div>
                </div>
              </Link>
              <Link to="#" className="app-download">
                <div className="app-icon">
                  <IoLogoApple />
                </div>
                <div className="app-text">
                  <div className="small-text">Download on the</div>
                  <div className="main-text">App Store</div>
                </div>
              </Link>
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
