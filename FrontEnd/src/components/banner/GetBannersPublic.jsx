import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./banner.css";
import Banner from "./Banner";

import API from "../../config/apiConfig";

function GetBannersPublic() {
  const [banners, setBanners] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    getAllBanners();
  }, []);

  const getAllBanners = async () => {
    try {
      let headersList = {
        "Content-Type": "application/json",
      };
      let reqOptions = {
        url: API.BANNERS_PUBLIC,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      
      
      setBanners(response.data);

     
    } catch (error) {
      if(error.response){
        setToastMessage("Error al obtener los banners");
        setShowErrorToast(true);
      }
     
    }
  };

  return (
    <div>
      
      <div className="banners-container">
        <Banner banners={banners} />
      </div>


      {/* Toast error */}
      <ToastContainer position="top-end" className="p-3">
          <Toast
            bg="danger"
            onClose={() => setShowErrorToast(false)}
            show={showErrorToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
    </div>
  );
}

export default GetBannersPublic;