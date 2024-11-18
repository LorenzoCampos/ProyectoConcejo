// CMPage.js
import NavCM from "../cmPage/navCM/NavCM"; 
import ListBanners from "../cmPage/getBanners/ListBanners";
import BannerForm from "../cmPage/bannerForm/BannerForm";
import ListNews from "../cmPage/listNews/ListNews";
import NewsForm from "../cmPage/newsForm/NewsForm";
//import { useState } from "react";
import { Routes, Route } from "react-router-dom";

function CMPage() {
  return (
    <>
 
      <NavCM />
      <Routes>
        <Route path="" element={<ListBanners />} />
        <Route path="cargar-banner" element={<BannerForm />} />
        <Route path="ver-noticias" element={<ListNews />} />
        <Route path="cargar-noticia" element={<NewsForm />} />
      </Routes>
    </>
  );
 
}

export default CMPage;

