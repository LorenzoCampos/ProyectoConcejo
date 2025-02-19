import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import axios from "axios";
import ListBanners from "../listBanners/ListBanners";

import "./bannerForm.css";
import API from "../../../config/apiConfig";

function BannerForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0);
  const [showBannerList, setShowBannerList] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);



  // Maneja el cambio de la imagen seleccionada
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

{/*    if (!selectedFile || !unpublicationDate) {
      setToastMessage("Por favor, completa todos los campos.");
      setShowWarningToast(true);
      return;
    }*/}

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("status", status);
    formData.append("type", "banner");

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(API.CREATE_BANNERS, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      if (response.status === 201) {
        setToastMessage("Banner subido exitosamente");
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowBannerList(true);
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al subir el Banner");
        setShowWarningToast(true);
      }
    }
  };
  if (showBannerList) {
    return <ListBanners />;
  }

  return (
    <div className="page-form">
      <div className="content-page-container">
        <h1 className="internal-title">Cargar Banner</h1>
        <div className="content-form">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile">
              <Form.Label>Seleccionar imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group controlId="status" className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={0}>Inactivo</option>
                <option value={1}>Activo</option>
              </Form.Select>
            </Form.Group>

            <div className="btn-container">
              <Button className="btn-banner" type="submit">
                Subir Banner
              </Button>
            </div>
          </Form>
        </div>
      </div>

     

      {/* Toasts para feedback */}
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
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="warning"
          onClose={() => setShowWarningToast(false)}
          show={showWarningToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default BannerForm;
