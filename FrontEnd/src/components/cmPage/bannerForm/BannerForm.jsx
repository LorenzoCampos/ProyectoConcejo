import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

function BannerForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(0); // Estado inicial en 0
  const [publicationDate, setPublicationDate] = useState("");
  const [unpublicationDate, setUnpublicationDate] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen
  const [errors, setErrors] = useState({}); // Para manejar errores

  // Mapea los mensajes de error genéricos a mensajes personalizados
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
  };

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
    formData.append("type", "banner"); // 

    try {
      const response = await axios.post(
        "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/new/create", // Cambia esto por tu endpoint
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
      if (error.response) {
        console.error("Error status:", error.response.status); // Esto te dirá si es un 422
        console.error("Error data:", error.response.data); // Aquí deberías ver el JSON con los errores

        if (error.response.status === 422) {
          const backendErrors = error.response.data.errors;
          let customErrors = {};

          // Recorre los errores y asigna mensajes personalizados
          Object.keys(backendErrors).forEach((field) => {
            const fieldErrors = backendErrors[field];
            customErrors[field] = fieldErrors.map((errorMsg) => {
              if (errorMsg.includes("required")) {
                return (
                  errorMessages[field]?.required || "Este campo es obligatorio."
                );
              } else if (errorMsg.includes("invalid")) {
                return (
                  errorMessages[field]?.invalid || "Este valor es inválido."
                );
              } else {
                return errorMsg; // Retornar el mensaje genérico si no hay un mapeo
              }
            });
          });

          setErrors(customErrors); // Actualizar los errores personalizados
        } else {
          alert("Hubo un error inesperado.");
          console.error("Error inesperado:", error);
        }
      } else {
        alert("Hubo un problema al conectar con el servidor.");
        console.error("Error en la conexión:", error);
      }
    }
  };

  return (
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
                  {errors.image[0]} {/* Mostrar el primer mensaje de error */}
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
