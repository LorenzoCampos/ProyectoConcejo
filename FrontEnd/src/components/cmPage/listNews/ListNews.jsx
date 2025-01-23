import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import DeleteModal from "../deleteModal/DeleteModal";

import "./listNews.css";

import API from "../../../config/apiConfig";

const modules = {
  toolbar: [
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    ['blockquote'],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    ['clean'] 
  ],
};

function ListNews() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // Estado del filtro

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [currentNewId, setCurrentNewId] = useState(null);
  const [currentNewStatus, setCurrentNewStatus] = useState("");
  const [currentNewPublicationDate, setCurrentNewPublicationDate] =
    useState("");
  const [currentNewUnpublicationDate, setCurrentNewUnpublicationDate] =
    useState("");
  const [currentNewTitle, setCurrentNewTitle] = useState("");
  const [currentNewDescription, setCurrentNewDescription] = useState("");

  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [currentNewsIdToDelete, setCurrentNewsIdToDelete] = useState(null);
const [itemType, setItemType] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    getAlldata();
  }, []);

  const getAlldata = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.LIST_NEWS,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
      setFilteredData(response.data); // Mostrar todos los datos inicialmente
      /* console.log(response.data); */
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al obtener las noticias.");
        setShowErrorToast(true);
      }
    }
  };

  const openModalNew = (news) => {
    setCurrentNewId(news.id);
    setCurrentNewStatus(news.status);
    setCurrentNewPublicationDate(news.publication_date);
    setCurrentNewUnpublicationDate(news.unpublication_date);
    setCurrentNewDescription(news.description);
    setCurrentNewTitle(news.title);
    setCurrentImage(news.image);
    setShowModal(true);
  };

  const updateState = async (e) => {
    e.preventDefault();

    const newState = currentNewStatus;

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      };

      /* let bodyContent = JSON.stringify({
        status: newState,
        publication_date: currentNewPublicationDate,
        unpublication_date: currentNewUnpublicationDate,
        title: currentNewTitle,
        description: currentNewDescription,
      });*/

      let bodyContent = new FormData();
      bodyContent.append("status", newState);
      bodyContent.append("publication_date", currentNewPublicationDate || "");
      bodyContent.append("unpublication_date", currentNewUnpublicationDate || "");
      bodyContent.append("title", currentNewTitle);
      bodyContent.append("description", currentNewDescription);

      if (selectedFile) {
        bodyContent.append("image", selectedFile);
      }

      // Agregar imagen solo si hay una nueva seleccionada
      /* if (currentImage) {
        bodyContent.append("image", currentImage);
      }*/

      await axios.post(API.UPDATE_NEWS + currentNewId, bodyContent, {
        headers: headersList,
      });

      console.log(bodyContent);
      setToastMessage(`Noticia actualizada correctamente.`);
      setShowSuccessToast(true);
      setShowModal(false);
      getAlldata(); // Refrescar la lista después de actualizar el estado
    } catch (error) {
      setToastMessage("Error al actualizar la noticia.");
      setShowErrorToast(true);
      console.log(error); // Agrega este para ver el error completo en la consola
      console.log(error.response ? error.response.data : "No response data"); // Verifica si error.response existe
    }
  };

  const deleteNews = (newsId) => {
    setItemType("noticia");
    setCurrentNewsIdToDelete(newsId);
    setShowDeleteModal(true); 
  };
  const handleDelete = async () => {
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "multipart/form-data",
        };

        await axios.delete(API.DELETE_NEWS + currentNewsIdToDelete, { headers: headersList });
        setToastMessage("Noticia eliminada correctamente.");
        setShowSuccessToast(true);
        getAlldata(); // Refrescar la lista
        setShowDeleteModal(false)
      } catch (error) {
        setToastMessage("Error al eliminar la noticia.");
        setShowErrorToast(true);
        setShowDeleteModal(false)
      }
      
    
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterStatus(selectedFilter);

    // Filtrar los datos en función del valor seleccionado
    if (selectedFilter === "Activo") {
      setFilteredData(data.filter((banner) => banner.status === 1));
    } else if (selectedFilter === "Inactivo") {
      setFilteredData(data.filter((banner) => banner.status === 0));
    } else {
      setFilteredData(data); // Mostrar todos los datos si no hay filtro
    }
  };

  return (
    <div className="news-container">
      <h1 className="title-text">Lista de Noticias</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th className="desc">Descripción</th>
              {/* <th>Fecha de publicación</th>
              <th>Fecha de despublicación</th> */}
              <th>
                <Form.Select
                  aria-label="Filtrar por estado"
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por estado</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Form.Select>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((news) => {
              // Sanitizar la descripción antes de usar dangerouslySetInnerHTML
              const sanitizedDescription = DOMPurify.sanitize(news.description);

              return (
                <tr key={news.id}>
                  <td>
                    <img
                      src={news.image}
                      alt="banner"
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td className="title-new-td">{news.title}</td>
                  <td
                    className="desc"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  ></td>
                  {/* <td>{news.publication_date}</td>
                  <td>{news.unpublication_date}</td> */}
                  <td>{news.status === 1 ? "Activo" : "Inactivo"}</td>

                  <td>
                    <Button
                      className="me-2"
                      variant="primary"
                      onClick={() => openModalNew(news)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteNews(news.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateState}>
            <Form.Group>
              <img
                src={currentImage}
                alt="img"
                style={{ width: "200px", marginLeft: "25%" }}
              />
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Seleccionar imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={currentNewStatus}
                onChange={(e) => setCurrentNewStatus(Number(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Titulo</Form.Label>
              <Form.Control
                type="text"
                value={currentNewTitle}
                onChange={(e) => setCurrentNewTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              {/* Usamos ReactQuill aquí */}
              <ReactQuill
                value={currentNewDescription}
                onChange={(value) => setCurrentNewDescription(value)}
                modules={modules} // Barra de herramientas personalizada
                placeholder="Escribe la descripción aquí..."
              />
            </Form.Group>

            {/* <Form.Group>
              <Form.Label>Fecha de publicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentNewPublicationDate}
                onChange={(e) => setCurrentNewPublicationDate(e.target.value)}
                disabled={currentNewStatus === 1}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de despublicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentNewUnpublicationDate}
                onChange={(e) => setCurrentNewUnpublicationDate(e.target.value)}
              />
            </Form.Group> */}

            <div className="btn-savechange">
              <Button type="submit" className="btn-news">
                Guardar cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemType={itemType}
      />

      {/* Toasts */}
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

        <Toast
          bg="warning"
          onClose={() => setShowWarningToast(false)}
          show={showWarningToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>

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

export default ListNews;
