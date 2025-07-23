import banner from '../../assets/images/banner.png';
const Banner = () => {
  return (
    <section style={{position: "relative"}}>
      <img src={banner} alt="" width="100%" />
      <div className="curated">
        <p>Events specially curated for you!</p>
        <button className="curated-btn">Get Started ➔</button>
      </div>
    </section>
  )
}

export default Banner