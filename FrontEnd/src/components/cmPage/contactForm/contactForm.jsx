import {useState} from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";

import API from "../../../config/apiConfig";
function ContactForm() {

  const [imgIzquierda, setImgIzquierda] = useState("");
  const [imgDerecha, setImgDerecha] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImage(file);
    } else {
      setToastMessage("Solo se permiten archivos PNG o JPG.");
      setShowWarningToast(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgIzquierda && !imgDerecha) {
      setToastMessage("Debe seleccionar al menos una imagen.");
      setShowWarningToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("image_left", imgIzquierda);
    formData.append("image_right", imgDerecha);
    console.log(formData);

    try {
      const response = await axios.post(API.UPLOAD_CONTACT, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setToastMessage("Imágenes cargadas exitosamente.");
        setShowSuccessToast(true);
      }

    } catch (error) {
      setToastMessage("Error al cargar las imágenes.");
      setShowErrorToast(true);
    }
  };

  return (
    <> 
      <div className="page-form">
        <div className="content-page-container">
          <h1 className="internal-title">Imagenes del apartado contactos</h1>
          <div className="content-form">
          <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen izquierda:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleFileChange(e, setImgIzquierda)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Imagen derecha:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleFileChange(e, setImgDerecha)}
                />
              </Form.Group>
              <Button type="submit">Cargar imágenes</Button>
            </Form>
          </div>
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
        
    </>

  )
}

export default ContactForm;