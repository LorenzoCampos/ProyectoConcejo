/* import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button"; */

import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState } from "react";

import axios from "axios";

import "./bannerForm.css";

const API =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/new/create";

function BannerForm() {
  /*   const [image, setImage] = useState("");
  const [status, setStatus] = useState(false);
  const [publication_date, setPublicationDate] = useState("");
  const [unpublication_date, setUnpublicationDate] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false); */

  /* const [showSuccessToast, setShowSuccessToast] = useState(false); */

  /*   const bannerData = async (e) => {
    e.preventDefault();

    if (!image) {
      let message = "Debe seleccionar una imagen.";
      setToastMessage(message);
      setShowErrorToast(true);
      return;
    }

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      };

      let bodyContent = JSON.stringify({
        type: "banner",
        image: image,
        status: status,
        publication_date: publication_date,
        unpublication_date: unpublication_date,
      });

      const response = await axios.post(API, bodyContent, {
        headers: headersList,
      });

      if (response.status === 200) {
        let message = "Banner creado correctamente.";
        setToastMessage(message);
        setShowSuccessToast(true);
      }
    } catch (error) {

      if (error.response.status === 400) {
        console.log(error.response.data.message);
        let message = error.response.data.message;
        setToastMessage(message);
        setShowErrorToast(true);
      }

      if (error.response.status === 422) {
        console.log(error.response.data.message);
        let message = error.response.data.message;
        setToastMessage(message);
        setShowErrorToast(true);

        if (error.response.data.errors.image) {
          console.log(error.response.data.errors.image);
          let message = error.response.data.errors.image;
          setToastMessage(message);
          setShowErrorToast(true);
        }

        if (error.response.data.errors.status) {
          console.log(error.response.data.errors.status);
          let message = error.response.data.errors.status;
          setToastMessage(message);
          setShowErrorToast(true);
        }

        if (error.response.data.errors.publication_date) {
          console.log(error.response.data.errors.publication_date);
          let message = error.response.data.errors.publication_date;
          setToastMessage(message);
          setShowErrorToast(true);
        }

        if (error.response.data.errors.unpublication_date) {
          console.log(error.response.data.errors.unpublication_date);
          let message = error.response.data.errors.unpublication_date;
          setToastMessage(message);
          setShowErrorToast(true);
        }
      }
    }
  }; */

  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0); // Estado inicial en 0
  const [publicationDate, setPublicationDate] = useState("");
  const [unpublicationDate, setUnpublicationDate] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen
  const [errors, setErrors] = useState({}); // Para manejar errores

  // Maneja el cambio de la imagen seleccionada
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Generar vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple para asegurarnos que se ingresan todos los datos
    if (!selectedFile || !publicationDate || !unpublicationDate) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Crear el FormData para enviar al backend
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("status", status); // Enviar el estado como 0 o 1
    formData.append("publication_date", publicationDate); // Formato de fecha
    formData.append("unpublication_date", unpublicationDate);

    try {
      const response = await axios.post(
        API, // Cambia esto por tu endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data); // Manejar la respuesta del servidor
      alert("Banner subido exitosamente");

      // Limpiar los errores si la petición es exitosa
      setErrors({});
    } catch (error) {
      // Si hay errores desde el backend, actualizamos el estado de errores
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Hubo un error inesperado al subir el banner");
        console.error("Error inesperado:", error);
      }
    }
  };

  return (
    /* <div className="form-container">
      <div className="banner-form">
        <h2>Crear nuevo banner</h2>

        <Form onSubmit={bannerData}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="form-label">Imagen:</Form.Label>
            <Form.Control
              type="file"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Estado:</Form.Label>

            <InputGroup className="mb-3">
              <InputGroup.Checkbox
                type="checkbox"
                value={status}
                onChange={() => setStatus(true)}
              />
              <Form.Check.Label className="form-label">Activo</Form.Check.Label>
            </InputGroup>

            <Form.Label className="form-label">
              {" "}
              Fecha de publicación:
            </Form.Label>
            <div>
              <input
                type="datetime-local"
                value={publication_date}
                onChange={(event) => setPublicationDate(event.target.value)}
              />
            </div>

            <Form.Label className="form-label">Fecha de expiración:</Form.Label>
            <div>
              <input
                type="datetime-local"
                value={unpublication_date}
                onChange={(event) => setUnpublicationDate(event.target.value)}
              />
            </div>
          </Form.Group>

          <div className="btn-container">
            <Button variant="primary" type="submit">
              Crear Banner
            </Button>
          </div>
        </Form>
      </div>

      
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
    </div> */

    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center">Subir Banner</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Seleccionar imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                isInvalid={!!errors.image}
              />
              {errors.image && (
                <Form.Control.Feedback type="invalid">
                  {errors.image[0]}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {imagePreview && (
              <div className="mb-3">
                <p>Vista previa de la imagen:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}

            <Form.Group controlId="status" className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                isInvalid={!!errors.status}
              >
                <option value={0}>Inactivo</option>
                <option value={1}>Activo</option>
              </Form.Control>
              {errors.status && (
                <Form.Control.Feedback type="invalid">
                  {errors.status[0]}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="publicationDate" className="mb-3">
              <Form.Label>Fecha de Publicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                isInvalid={!!errors.publication_date}
              />
              {errors.publication_date && (
                <Form.Control.Feedback type="invalid">
                  {errors.publication_date[0]}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="unpublicationDate" className="mb-3">
              <Form.Label>Fecha de Despublicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={unpublicationDate}
                onChange={(e) => setUnpublicationDate(e.target.value)}
                isInvalid={!!errors.unpublication_date}
              />
              {errors.unpublication_date && (
                <Form.Control.Feedback type="invalid">
                  {errors.unpublication_date[0]}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Subir Banner
            </Button>
          </Form>

          {/* Mostrar un mensaje de alerta si hay algún error general */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mt-3">
              Por favor, corrige los errores antes de continuar.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BannerForm;
