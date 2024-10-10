import NavCM from "../cmPage/navCM/NavCM";
import ListBanners from "../cmPage/getBanners/ListBanners";
import { useState } from "react";
import BannerForm from "../cmPage/bannerForm/BannerForm"
function CMPage() {
  const [showBannerForm, setShowBannerForm] = useState(false);
  
  const handleShowBannerForm = (value)=>{
    setShowBannerForm(value);
  }
  return (
    <>
      <NavCM onBannerFormClick={()=> handleShowBannerForm(true)}/>
      
     {showBannerForm ? <BannerForm/> : <ListBanners/>}
    </>
  );
}
export default CMPage;
