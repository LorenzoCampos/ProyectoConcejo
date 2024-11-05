import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import PreviewNews from "./PreviewNews";
import "./newsForm.css";

function NewsForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0); // Estado inicial en 0
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [unpublicationDate, setUnpublicationDate] = useState("");
  //const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen

  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  //const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);


  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  /*   // Mapea los mensajes de error genéricos a mensajes personalizados
  const errorMessages = {
    image: {
      required: "Por favor, selecciona una imagen para el banner.",
      file_type: "El archivo debe ser una imagen válida (jpeg, png, etc.).",
    },
    publication_date: {
      required: "La fecha de publicación es obligatoria.",
      invalid: "La fecha de publicación no es válida.",
    },
    unpublication_date: {
      required: "La fecha de despublicación es obligatoria.",
      invalid: "La fecha de despublicación no es válida.",
    },
    status: {
      invalid: "El estado seleccionado no es válido.",
    },
  }; */

  // Maneja el cambio de la imagen seleccionada
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Generar vista previa de la imagen
    {
      /* const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }*/
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple para asegurarnos que se ingresan todos los datos
    if (!selectedFile || !unpublicationDate) {
      setToastMessage("Por favor, completa todos los campos.");
      setShowWarningToast(true);
      return;
    }

    // Crear el FormData para enviar al backend
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("status", status); // Enviar el estado como 0 o 1
    formData.append("title", title);
    formData.append("description", description);
    formData.append("publication_date", publicationDate); // Formato de fecha
    formData.append("unpublication_date", unpublicationDate);
    formData.append("type", "new"); //

    try {
      const response = await axios.post(
        API.CREATE_NEWS,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "aplication/json",
          },
        }
      );

      console.log(response.data);
      if (response.status === 201) {
        setToastMessage("Noticia subida exitosamente");
        setShowSuccessToast(true);
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Estado de la respuesta de error:",
          error.response.status
        );

        console.error(
          "Encabezados de la respuesta de error:",
          error.response.headers
        );

        /*  if(error.response.status === 422) {
          Especificar errores
        } */

        setToastMessage("Error al subir la noticia");
        setShowWarningToast(true);
      }
    }
  };

  return (
    <div className="container">
      <div className="news-form">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center title-text">Cargar Noticia</h1>
              <div className="form-news">
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile">
                    <Form.Label>Seleccionar imagen</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>

                  {/* {imagePreview && (
                  <div className="mb-3">
                    <p>Vista previa de la imagen:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: "50%", height: "auto", marginLeft: "25%" }}
                    />
                  </div>
                )}*/}

                  <Form.Group controlId="status" className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      as="select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value={0}>Inactivo</option>
                      <option value={1}>Activo</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                     as="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </Form.Group>

                  <Form.Group controlId="publicationDate" className="mb-3">
                    <Form.Label>Fecha de Publicación</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      disabled={status === "1"} 
                      required={status === "0"}
                    />
                  </Form.Group>

                  <Form.Group controlId="unpublicationDate" className="mb-3">
                    <Form.Label>Fecha de Despublicación</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={unpublicationDate}
                      onChange={(e) => setUnpublicationDate(e.target.value)}
                      required={status === "1"}
                    />
                  </Form.Group>
                  <div className="btn-container">
                    <Button className="btn-news" onClick={openModal}>
                      Vista Previa
                    </Button>
                    <Button className="btn-news" type="submit">
                      Subir Noticia
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <PreviewNews isOpen={isOpen} closeModal={closeModal}  file={selectedFile} title={title}
        description={description} />

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

      {/* Toast exito */}
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

      {/* Toast exito */}
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

export default NewsForm;
