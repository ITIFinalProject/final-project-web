import '../styles/home.css'
import Hero from '../components/Home/Hero'
import Categories from '../components/Home/Categories'
import Trending from '../components/Home/Trending'
import Banner from '../components/Home/Banner'
import Calender from '../components/Home/Calendar'
import CountDown from '../components/Home/CountDown'
import CreateBanner from '../components/Home/CreateBanner'

const Home = () => {
    return (
        <section className='home-page'>
            <Hero />
            <Categories />
            <Trending />
            <Banner />
            <Calender />
            <CountDown />
            <CreateBanner />
        </section>
    )
}

export default Home