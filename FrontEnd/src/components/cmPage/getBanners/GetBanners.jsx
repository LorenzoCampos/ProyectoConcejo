import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./getBanners.css";

function GetBanners() {
  const [banners, setBanners] = useState([]);
  const [showErrorToast, setShowErrorToast] = useState(false);
  /* const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false); */
  const [toastMessage, setToastMessage] = useState("");

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
        url: "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/banner/all",
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setBanners(response.data);
    } catch (error) {
      if(error.response){
        let message = "Error al obtener los banners";
        setShowErrorToast(true);
        setToastMessage(message);
      }
     
    }
  };

  return (
    <div>
      <div className="banners-container">
        <h1>Banners</h1>
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