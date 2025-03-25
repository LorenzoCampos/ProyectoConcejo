import Contact from "../contact/Contact";
import Social from "../social/Social";
import GetBannersPublic from "../banner/GetBannersPublic";
import GetNewsPublic from "../news/GetNewsPublic"

import Sessions from "../sessions/Sessions";
import "./home.css";
import Weather from "../weather/Weather";
import NavBar from "../navbar/Navbar";

function Home() {


  return (
   <>
         <div>
          <NavBar />
          <GetBannersPublic />
          <Weather />
          <Sessions />
          <GetNewsPublic/>
          <Contact />
          <Social />
         </div>
        
          </>

  );
}
export default Home;