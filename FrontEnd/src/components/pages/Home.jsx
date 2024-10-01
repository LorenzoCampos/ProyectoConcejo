import Banner from "../banner/Banner";
import Contact from "../contact/Contact";
import News from "../news/News";
import Social from "../social/Social";
import Logout from "../logout/Logout";

function Home() {
    return(
        <>
        <Banner/>
        <News/>
        <Contact/>
        <Social />
        <Logout />
        </>
    )
}
export default Home;