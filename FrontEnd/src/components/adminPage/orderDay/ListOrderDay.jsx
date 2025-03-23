import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";

import { Link } from "react-router-dom";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";
import axios from "axios";

import { FaRegFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import API from "../../../config/apiConfig";

function ListOrderDay() {
  const [userRole, setUserRole] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [from, setFromDate] = useState("");
  const [to, setToDate] = useState("");

  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRole(userRole);
  }, []);

  const getOrdersPDF = async (page = 1, s = {}) => {
    setLoading(true);
    try {
      let headersList = {
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.ORDERS_PUBLIC + `?page=${page}`,
        method: "GET",
        headers: headersList,
        params: {
          ...s,
        },
      };

      const response = await axios.request(reqOptions);

      setData(response.data.data);
      setCurrentPage(response.data.current_page); // Actualiza la página actual
      setLastPage(response.data.last_page); // Actualiza la última página
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al obtener las normativas.");
        setShowErrorToast(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrdersPDF(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      getOrdersPDF(newPage, {
        from,
        to,
      });
    }
  };

  const handleFilter = () => {
    getOrdersPDF(1, {
      from,
      to,
    });
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    getOrdersPDF(1, {});
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Función para mostrar el modal y establecer la ID de la orden a eliminar
  const handleShowDeleteModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;

    try {
     
      const response = await axios.delete(`${API.DELETE_ORDER}` + selectedOrderId);

      if (response.status === 200) {
        setToastMessage("Orden eliminada exitosamente.");
        setShowSuccessToast(true);

        window.scrollTo(0, 0); // Desplazar hacia arriba
        setTimeout(() => {
          window.location.reload(); // Recargar la página
        }, 1500);
      }
    } catch (error) {
      setToastMessage("Error al eliminar la orden.");
      setShowErrorToast(true);
    }

    setShowDeleteModal(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="page-table">
      <div className="content-page-container">
        <h1 className="internal-title">Ordenes del día</h1>
        <div className="filter-regulations">
          <div className="filter-inputs">
            <div className="filter-group">
              <Form.Label>Desde:</Form.Label>
              <Form.Control
                type="date"
                className="filter-input-border"
                placeholder="Desde..."
                value={from}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <Form.Label>Hasta:</Form.Label>
              <Form.Control
                type="date"
                className="filter-input-border"
                placeholder="Hasta..."
                value={to}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-buttons">
            <Button variant="dark" onClick={handleClearFilters}>
              Limpiar
            </Button>
            <Button variant="primary" onClick={handleFilter}>
              Filtrar
            </Button>
          </div>
        </div>

        {userRole === "admin" && (
          <>
            <div className="cont-button-order">
              <Button
                className="btn-banner"
                as={Link}
                to="/admin/cargar-orden-dia"
              >
                Crear Nueva Orden del Día
              </Button>
            </div>
          </>
        )}

        <div className="content-table">
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status" size="md">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <table className="content-table__table">
              <thead>
                <tr>
                  <th>Fecha de creación</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order.id}>
                    <td data-title="Fecha de creación">
                      {formatDate(order.date_creation)}
                    </td>

                    <td data-title="Acciones">
                      <div className="accion-buttons">
                        <div>
                          <a target="_blank" href={order.pdf_path}>
                            <Button
                              variant="primary"
                              className="pdf-btn"
                              title="Ver PDF"
                            >
                              <FaRegFilePdf style={{ color: "white" }} />
                            </Button>
                          </a>
                        </div>
                        {userRole === "admin" && (
                          <div>
                            <Button
                              title="Eliminar Orden del Día"
                              variant="danger"
                              onClick={() => handleShowDeleteModal(order.id)}
                              className="delete-pdf-btn"
                            >
                              <MdDelete size={21} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination>
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          />
          <Pagination.Last
            onClick={() => handlePageChange(lastPage)}
            disabled={currentPage === lastPage}
          />
        </Pagination>

        {/* Modal de confirmación */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar esta orden del día?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteOrder}>
              Eliminar
            </Button>
          </Modal.Footer>
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
    </div>
  );
}

export default ListOrderDay;
