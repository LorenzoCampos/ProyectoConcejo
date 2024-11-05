import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import "./getBanners.css";
import API from "../../../config/apiConfig";

function ListBanners() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);

  const [currentBannerStatus, setCurrentBannerStatus] = useState("");
  const [currentBannerPublicationDate, setCurrentBannerPublicationDate] =
    useState("");
  const [currentBannerUnpublicationDate, setCurrentBannerUnpublicationDate] =
    useState("");

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
        url: API.LIST_BANNERS,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al obtener los banners.");
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

  const openModal = (banner) => {
    setCurrentBannerId(banner.id);
    setCurrentBannerStatus(banner.status === 1 ? "Activo" : "Inactivo");
    setCurrentBannerPublicationDate(banner.publication_date);
    setCurrentBannerUnpublicationDate(banner.unpublication_date);
    setShowModal(true);
  };

  const updateState = async (e) => {
    e.preventDefault();

    const newState = currentBannerStatus === "Activo" ? 1 : 0;

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        status: newState,
        publication_date: currentBannerPublicationDate,
        unpublication_date: currentBannerUnpublicationDate,
      });

      await axios.patch(
        API.UPDATE_BANNERS + currentBannerId,
        bodyContent,
        { headers: headersList }
      );

      setToastMessage(`Actualizado correctamente.`);
      setShowSuccessToast(true);
      getAlldata();
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      setToastMessage("Error al actualizar");
      setShowErrorToast(true);

      if (error.response) {
        setToastMessage("Error al actualizar el banner.");
        setShowErrorToast(true);
        console.log(error.response.data);
      }
    }
  };

  const deleteBanner = async (bannerId) => {
    let alertConfirm = confirm("¿Deseas eliminar este banner?");

    if (alertConfirm) {
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "application/json",
        };

        await axios.delete(
          API.DELETE_BANNERS + bannerId,
          { headers: headersList }
        );
        setToastMessage("Banner eliminado correctamente.");
        setShowSuccessToast(true);
        getAlldata(); // Refrescar la lista
      } catch (error) {
        setToastMessage("Error al eliminar el banner.");
        setShowErrorToast(true);
      }
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterStatus(selectedFilter);

    if (selectedFilter === "Activo") {
      setFilteredData(data.filter((banner) => banner.status === 1));
    } else if (selectedFilter === "Inactivo") {
      setFilteredData(data.filter((banner) => banner.status === 0));
    } else {
      setFilteredData(data); // Mostrar todos los datos si no hay filtro
    }
  };

  return (
    <div className="banner-container">
      <h1 className="title-text">Lista de Banners</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Imagen</th>
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
            {filteredData.map((banner) => (
              <tr key={banner.id} className="tb-table">
                <td>
                  <img
                    src={banner.image}
                    alt="banner"
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{banner.publication_date}</td>
                <td>{banner.unpublication_date}</td>
                <td>{banner.status === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button
                    className="me-2"
                    variant="primary"
                    onClick={() => openModal(banner)} // Abre el modal con el banner seleccionado
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteBanner(banner.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateState}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={currentBannerStatus} // Muestra el estado actual del banner
                onChange={(e) => setCurrentBannerStatus(e.target.value)} // Actualiza el estado seleccionado
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de publicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentBannerPublicationDate}
                onChange={(e) =>
                  setCurrentBannerPublicationDate(e.target.value)
                }
                disabled={currentBannerStatus === "1"} 
                required={currentBannerStatus === "0"}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Fecha de despublicación</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentBannerUnpublicationDate}
                onChange={(e) =>
                  setCurrentBannerUnpublicationDate(e.target.value)
                }
                required={currentBannerStatus === "1"}
              />
            </Form.Group>
            <div className="btn-savechange">
              <Button type="submit" className="btn-banner">
                Guardar cambios
              </Button>
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

export default ListBanners;
