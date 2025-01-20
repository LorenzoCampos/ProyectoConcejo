// CMPage.js
import NavCM from "../cmPage/navCM/NavCM"; 
import ListBanners from "../cmPage/getBanners/ListBanners";
import BannerForm from "../cmPage/bannerForm/BannerForm";
import ListNews from "../cmPage/listNews/ListNews";
import NewsForm from "../cmPage/newsForm/NewsForm";
import Perfil from "../cmPage/perfil/Perfil";
//import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";

function CMPage() {
  return (
    <>
      <NavbarForRole/>
      <Routes>
        <Route path="" element={<ListBanners />} />
        <Route path="cargar-banner" element={<BannerForm />} />
        <Route path="ver-noticias" element={<ListNews />} />
        <Route path="cargar-noticia" element={<NewsForm />} />
        <Route path="perfil" element={<Perfil />} />
      </Routes>
    </>
  );
 
}

export default CMPage;

