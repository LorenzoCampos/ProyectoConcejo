import Banner from "../banner/Banner";
import Contact from "../contact/Contact";
import News from "../news/News";
import Social from "../social/Social";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function Home() {
    return(
        <>
        <Navbar/>
        <Banner/>
        <News/>
        <Contact/>
        <Social />
        <Footer/>
        </>
    )
}
export default Home;