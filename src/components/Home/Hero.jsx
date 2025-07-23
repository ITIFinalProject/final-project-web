
const Hero = () => {
  return (
    <section className="hero">
            <h1>Don’t miss out!</h1>
            <p>Explore the <span className="highlight">vibrant events</span> happening locally and globally.</p>
            <div className="search-bar">
                <input type="text" placeholder="Search Events, Categories, Locations..."/>
                <select>
                    <option>Cairo</option>
                </select>
            </div>
    </section>
  )
}

export default Hero