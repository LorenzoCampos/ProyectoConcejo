import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import axios from "axios";
import Preview from "./Preview";

import "./bannerForm.css";

function BannerForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0);
  const [publicationDate, setPublicationDate] = useState("");
  const [unpublicationDate, setUnpublicationDate] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // Maneja el cambio de la imagen seleccionada
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !publicationDate || !unpublicationDate) {
      setToastMessage("Por favor, completa todos los campos.");
      setShowWarningToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("status", status);
    formData.append("publication_date", publicationDate);
    formData.append("unpublication_date", unpublicationDate);
    formData.append("type", "banner");
    
    
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log("Status:", status);
  console.log("Publication Date:", publicationDate);
  console.log("Unpublication Date:", unpublicationDate);

    try {
      const response = await axios.post(
        "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/v1/news-banners",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setToastMessage("Banner subido exitosamente");
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error("Error Response:", error.response.data);
      if (error.response) {
        setToastMessage("Error al subir el Banner");
        setShowWarningToast(true);
      }
    }
  };

  return (
    <div className="container">
      
        <Container>
          <Row>
            <Col>
              <h1 className="text-center title-text">Cargar Banner</h1>
              <div className="form-banner">
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

                <Form.Group controlId="publicationDate" className="mb-3">
                  <Form.Label>Fecha de Publicación</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="unpublicationDate" className="mb-3">
                  <Form.Label>Fecha de Despublicación</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={unpublicationDate}
                    onChange={(e) => setUnpublicationDate(e.target.value)}
                  />
                </Form.Group>
                <div className="btn-container">
                  <Button onClick={openModal} className="btn-banner">
                    Vista Previa
                  </Button>
                  <Button className="btn-banner" type="submit">
                    Subir Banner
                  </Button>
                </div>
              </Form>
              </div>
            </Col>
          </Row>
        </Container>
     
      <Preview isOpen={isOpen} closeModal={closeModal} file={selectedFile} />

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
