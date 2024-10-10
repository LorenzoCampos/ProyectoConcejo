// CMPage.js
import NavCM from "../cmPage/navCM/NavCM"; 
import ListBanners from "../cmPage/getBanners/ListBanners";
import BannerForm from "../cmPage/bannerForm/BannerForm";
import ListNews from "../cmPage/listNews/ListNews";
import NewsForm from "../cmPage/newsForm/NewsForm";
import { useState } from "react";

function CMPage() {
  const [currentView, setCurrentView] = useState('listBanners'); // Estado único para manejar la vista actual

  const handleShowBannerForm = () => {
    setCurrentView('bannerForm');
  };

  const handleShowListNews = () => {
    setCurrentView('listNews');
  };

  const handleShowNewsForm = () => {
    setCurrentView('newsForm');
  };

  const handleShowListBanners = () => {
    setCurrentView('listBanners');
  };

  return (
    <>
      <NavCM 
        onBannerFormClick={handleShowBannerForm}
        onNewsListClick={handleShowListNews}
        onNewsFormClick={handleShowNewsForm}
        onBannersListClick={handleShowListBanners} // Este callback reemplaza el reload
      />
      
      {currentView === 'bannerForm' && <BannerForm />}
      {currentView === 'listNews' && <ListNews />}
      {currentView === 'newsForm' && <NewsForm />}
      {currentView === 'listBanners' && <ListBanners />}
    </>
  );
}

export default CMPage;

