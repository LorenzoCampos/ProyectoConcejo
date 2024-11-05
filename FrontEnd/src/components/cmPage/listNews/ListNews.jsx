import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import "./listNews.css";

import API from "../../../config/apiConfig";

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

/*   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Retornar en el formato YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }; */

  const openModalNew = (news) => {
    setCurrentNewId(news.id);
    setCurrentNewStatus(news.status === 1 ? "Activo" : "Inactivo");
    setCurrentNewPublicationDate(news.publication_date);
    setCurrentNewUnpublicationDate(news.unpublication_date);
    setCurrentNewDescription(news.description);
    setCurrentNewTitle(news.title);
    setShowModal(true);
  };

  const updateState = async (e) => {
    e.preventDefault();

    const newState = currentNewStatus === "Activo" ? 1 : 0;

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      };

      let bodyContent = JSON.stringify({
        status: newState,
        publication_date: currentNewPublicationDate,
        unpublication_date: currentNewUnpublicationDate,
        title: currentNewTitle,
        description: currentNewDescription,
      });

      await axios.patch(
        API.UPDATE_NEWS + currentNewId,
        bodyContent,
        { headers: headersList }
      );

      setToastMessage(`Actualizado correctamente.`);
      setShowSuccessToast(true);

      getAlldata(); // Refrescar la lista después de actualizar el estado
    } catch (error) {
      setToastMessage("Error al actualizar el estado.");
      setShowErrorToast(true);
    }
  };

  const deleteNews = async (newsId) => {
    let alertConfirm = confirm("¿Deseas eliminar esta noticia?");

    if (alertConfirm) {
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "application/json",
        };

        await axios.delete(
          API.DELETE_NEWS + newsId,
          { headers: headersList }
        );
        setToastMessage("Noticia eliminada correctamente.");
        setShowSuccessToast(true);
        getAlldata(); // Refrescar la lista
      } catch (error) {
        setToastMessage("Error al eliminar la noticia.");
        setShowErrorToast(true);
      }
      return;
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
              <th>Fecha de publicación</th>
              <th>Fecha de despublicación</th>
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
            {filteredData.map((news) => (
              <tr key={news.id}>
                <td>
                  <img
                    src={news.image}
                    alt="banner"
                    style={{ width: "100px" }}
                  />
                </td>
                <td className="title-new-td">{news.title}</td>
                <td className="desc">{news.description}</td>
                <td>{news.publication_date}</td>
                <td>{news.unpublication_date}</td>
                <td>{news.status === 1 ? "Activo" : "Inactivo"}</td>

                <td>
                  <Button
                    className="me-2"
                    variant="primary"
                    onClick={() => openModalNew(news)}
                  >
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => deleteNews(news.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
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
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={currentNewStatus} // Muestra el estado actual de la noticia
                onChange={(e) => setCurrentNewStatus(e.target.value)} // Actualiza el estado seleccionado
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
              <Form.Control
                as="textarea"
                value={currentNewDescription}
                onChange={(e) => setCurrentNewDescription(e.target.value)}
                rows={4}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de publicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentNewPublicationDate}
                onChange={(e) => setCurrentNewPublicationDate(e.target.value)}
                disabled={currentNewStatus === "1"} 
                required={currentNewStatus === "0"}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de despublicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentNewUnpublicationDate}
                onChange={(e) => setCurrentNewUnpublicationDate(e.target.value)}
                required={currentNewStatus === "1"}
              />
            </Form.Group>
            <div className="btn-savechange ">
              <Button type="submit" className="btn-news">Guardar cambios</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

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
