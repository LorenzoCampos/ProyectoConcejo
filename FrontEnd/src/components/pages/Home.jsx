import Contact from "../contact/Contact";
import Social from "../social/Social";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import GetBannersPublic from "../banner/GetBannersPublic";
import GetNewsPublic from "../news/GetNewsPublic"
import { useState } from "react";
import SeeNew from "../news/SeeNew"
import Sessions from "../sessions/Sessions";
import "./home.css";

function Home() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedNews, setSelectedNews] = useState(null);

  const handleShowSeeNew = (newsItem) => {
    setSelectedNews(newsItem);
    setCurrentView("seeNew");
  };
  const handleSHowHome = () => {
    setCurrentView("home");
  };

  return (
    <>
      <Navbar onHomeClick={handleSHowHome} />
      <div className="page-home">
        {currentView === "home" && (
          <>
            <GetBannersPublic />
            <Sessions />
            <GetNewsPublic onSeeNew={handleShowSeeNew} />
            <Contact />
            <Social />
          </>
        )}
        {currentView === "seeNew" && <SeeNew news={selectedNews} />}
        <Footer />
      </div>
    </>
  );
}
export default Home;