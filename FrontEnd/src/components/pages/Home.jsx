import Contact from "../contact/Contact";
import News from "../news/News";
import Social from "../social/Social";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import GetBannersPublic from "../banner/GetBannersPublic";

function Home() {
    return(
        <>
        <Navbar/>
    
        <GetBannersPublic/>
        <News/>
        <Contact/>
        <Social />
        <Footer/>
        </>
    )
}
export default Home;