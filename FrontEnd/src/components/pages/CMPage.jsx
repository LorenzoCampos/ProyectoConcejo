// CMPage.js
import ListBanners from "../cmPage/listBanners/ListBanners";
import BannerForm from "../cmPage/bannerForm/BannerForm";
import ListNews from "../cmPage/listNews/ListNews";
import NewsForm from "../cmPage/newsForm/NewsForm";
import ContactForm from "../cmPage/contactForm/contactForm";
//import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";
import Profile from "../profile/Profile";

function CMPage() {
  return (
    <>
      <NavbarForRole/>
      <Routes>
        <Route path="" element={<ListBanners />} />
        <Route path="cargar-banner" element={<BannerForm />} />
        <Route path="gestionar-noticias" element={<ListNews />} />
        <Route path="cargar-noticia" element={<NewsForm />} />
        <Route path="cargar-contactos" element={<ContactForm />}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
 
}

export default CMPage;

