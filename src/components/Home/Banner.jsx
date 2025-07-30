import banner from '../../assets/images/banner.png';
import { Link } from 'react-router-dom';
const Banner = () => {
  return (
    <section style={{position: "relative"}}>
      <img src={banner} alt="" width="100%" />
      <div className="curated">
        <p>Events specially curated for you!</p>
        <Link to="/Events" ><button className="curated-btn">Get Started ➔</button></Link>
      </div>
    </section>
  )
}

export default Banner