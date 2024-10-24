import Contact from "../contact/Contact";
import Social from "../social/Social";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import GetBannersPublic from "../banner/GetBannersPublic";
import GetNewsPublic from "../news/GetNewsPublic"

function Home() {
    return(
        <>
        <Navbar/>
        <GetBannersPublic/>
        <GetNewsPublic/>
        <Contact/>
        <Social />
        <Footer/>
        </>
    )
}
export default Home;