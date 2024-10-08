import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./getBanners.css";
import Banner from "../../banner/Banner";

function GetBanners() {
  const [banners, setBanners] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    getAllBanners();
  }, []);

  const getAllBanners = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };
      let reqOptions = {
        url: "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/v1/banners",
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      /* console.log(response); */
      
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
        <h1>Banners</h1>
        {/* Pasa los banners obtenidos como props al componente Banner */}
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

export default GetBanners;