import { useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import PreviewNews from "./PreviewNews";
import "./newsForm.css";
import ListNews from "../listNews/ListNews";

import ReactQuill from "react-quill"; // Importa React Quill
import "react-quill/dist/quill.snow.css";

import API from "../../../config/apiConfig";

const modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    ["blockquote"],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    ["clean"],
    ["link"],
  ],
};

function NewsForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0); // Estado inicial en 0
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //const [publicationDate, setPublicationDate] = useState("");
  // const [unpublicationDate, setUnpublicationDate] = useState("");
  //const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen
  const [showNewsList, setShowNewsList] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Extraer miniatura del reel de instagram
  const [videoUrl, setVideoUrl] = useState("");

  //const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const [editorValue, setEditorValue] = useState("");

  const handleEditorChange = (value) => {
    setEditorValue(value);
    setDescription(value); // Guarda el valor del editor
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
    if (file) {
      setSelectedFile(file);
    }

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
    if (!status || !title || !description) {
      setToastMessage("Por favor, completa todos los campos.");
      setShowWarningToast(true);
      return;
    }

    if (!selectedFile && !videoUrl) {
      setToastMessage("Por favor, ingresa el link de Instagram o selecciona una imagen.");
      setShowWarningToast(true);
      return;
    }

    // Crear el FormData para enviar al backend
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("status", status); // Enviar el estado como 0 o 1
    formData.append("title", title);
    formData.append("video_url", videoUrl);
    formData.append("description", description);
    //formData.append("publication_date", publicationDate); // Formato de fecha
    //formData.append("unpublication_date", unpublicationDate);
    formData.append("type", "new");

    try {
      const response = await axios.post(API.CREATE_NEWS, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      if (response.status === 201) {
        setToastMessage("Noticia subido exitosamente");
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowNewsList(true);
        }, 3000); // Tiempo de espera de 3 segundos
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

        setToastMessage(error.response.data.message);
        setShowErrorToast(true);
        console.log("Detalles del error:", error.response.data);
      }
    }
  };
  if (showNewsList) {
    return <ListNews />;
  }

  return (
    <div className="container">
      <div className="news-form">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center title-text">Cargar Noticia</h1>
              <div className="form-news">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL del Video (Reel de Instagram)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa la URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </Form.Group>

{/*                   {thumbnail && (
                    <div className="text-center">
                      <p>Miniatura generada:</p>
                      <Image src={thumbnail} alt="Miniatura" fluid />
                    </div>
                  )} */}

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
                    <ReactQuill
                      as="textarea"
                      value={editorValue}
                      onChange={handleEditorChange}
                      rows={4}
                      placeholder="Escribe la descripción aquí..."
                      modules={modules}
                    />
                  </Form.Group>

                  {/* <Form.Group controlId="publicationDate" className="mb-3">
                    <Form.Label>Fecha de Publicación</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      disabled={status === "1"}
                      required={status === "0"}
                    />
                  </Form.Group> */}

                  {/* <Form.Group controlId="unpublicationDate" className="mb-3">
                    <Form.Label>Fecha de Despublicación</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={unpublicationDate}
                      onChange={(e) => setUnpublicationDate(e.target.value)}
                      required={status === "1"}
                    />
                  </Form.Group> */}
                  <div className="btn-container">
                    {/* <Button className="btn-news" onClick={openModal}>
                      Vista Previa
                    </Button> */}
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
      <PreviewNews
        isOpen={isOpen}
        closeModal={closeModal}
        file={selectedFile}
        title={title}
        description={description}
      />

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
