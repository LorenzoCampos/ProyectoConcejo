import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { FaRegFilePdf } from "react-icons/fa";

import API from "../../../config/apiConfig";

import "./regulations.css";

function ListRegulations() {
  const [userRole, setUserRole] = useState("");

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [from, setFromDate] = useState("");
  const [to, setToDate] = useState("");
  const [state, setState] = useState("");
  const [author_type, setAuthorType] = useState("");

  const navigate = useNavigate();

  // Función para manejar la redirección
  const handleEditClick = (id) => {
    navigate(`/admin/modificar-normativa/${id}`);
  };

  const getRegulations = async (page = 1, s = {}) => {
    console.log("s:", s);
    setLoading(true);
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.LIST_REGULATIONS + `?page=${page}`,
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
    // Obtener el rol del usuario desde el localStorage y establecerlo en el estado
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    getRegulations(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= lastPage) {
      getRegulations(newPage, {
        search,
        type,
        from,
        to,
        state,
        author_type,
      });
    }
  };

  const handleFilter = () => {
    getRegulations(1, {
      search,
      type,
      from,
      to,
      state,
      author_type,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setType("");
    setFromDate("");
    setToDate("");
    setState("");
    setAuthorType("");
    getRegulations(1, {});
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const typeTranslations = {
    ordinance: "Ordenanza",
    resolution: "Resolución",
    minutes: "Minutas",
    decree: "Decreto",
    declaration: "Declaración",
    correspondence: "Correspondencia",
  };
  function translateType(type) {
    return typeTranslations[type] || type; // Si no hay traducción, muestra el valor original
  }

  const stateTranslations = {
    process: "En proceso",
    approved: "Aprobado",
  };
  function translateState(state) {
    return stateTranslations[state] || state; // Si no hay traducción, devuelve el valor original
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="regulations-container">
      <h1 className="title-text">Lista de Normativas</h1>

      <div className="table-responsive">
        <table className="table">
          <tr>
            <th>
              <div className="th-input">
                <Form.Label>Buscador:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Texto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </th>
          </tr>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>
                <Form.Select
                  aria-label="Filtrar por tipo"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Tipo</option>
                  <option value="ordinance">Ordenanza</option>
                  <option value="resolution">Resolución</option>
                  <option value="minutes">Minuta</option>
                  <option value="decree">Decreto</option>
                  <option value="declaration">Declaración</option>
                  <option value="correspondence">Correspondencia</option>
                </Form.Select>
              </th>
              <th>
                <div className="th-input">
                  <Form.Label>Desde:</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Desde..."
                    value={from}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </th>
              <th>
                <div className="th-input">
                  <Form.Label>Hasta:</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Hasta..."
                    value={to}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </th>
              <th>
                <Form.Select
                  aria-label="Filtrar por estado"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Estado</option>
                  <option value="process">En proceso</option>
                  <option value="approved">Aprobado</option>
                </Form.Select>
              </th>
              <th>
                <Form.Select
                  aria-label="Filtrar por autor"
                  value={author_type}
                  onChange={(e) => setAuthorType(e.target.value)}
                >
                  <option value="">Autor</option>
                  <option value="Concejal">Concejal</option>
                  <option value="DEM">DEM</option>
                  <option value="Particular">Particular</option>
                </Form.Select>
              </th>
              <th>
                <Button variant="primary" onClick={handleFilter}>
                  Filtrar
                </Button>
              </th>
              <th>
                <Button variant="dark" onClick={handleClearFilters}>
                  Limpiar
                </Button>
              </th>
            </tr>
          </thead>
        </table>

        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" role="status" size="md">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr className="table-result">
                <th>Tipo</th>
                <th>N°</th>
                <th>Palabras Clave</th>
                <th>Fecha de creación</th>
                <th>Estado</th>
                <th>Tipo de Autor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((regulation) => (
                <tr key={regulation.id}>
                  <td>{translateType(regulation.type)}</td>
                  <td>{regulation.number}</td>
                  <td>
                    {regulation.keywords && regulation.keywords.length > 0 ? (
                      regulation.keywords.map((keyword, index) => (
                        <span key={index}>
                          {keyword.word.charAt(0).toUpperCase() +
                            keyword.word.slice(1)}
                          {index < regulation.keywords.length - 1 ? " - " : ""}
                        </span>
                      ))
                    ) : (
                      <span>No keywords available</span>
                    )}
                  </td>
                  <td>{formatDate(regulation.created_at)}</td>
                  <td>{translateState(regulation.state)}</td>
                  <td>{capitalizeFirstLetter(regulation.author_type)}</td>
                  <td>
                    <div className="td-buttons">
                      <td>
                        {regulation.pdf_approved && (
                          <a target="_blank" href={regulation.pdf_approved}>
                            <Button variant="primary" className="pdf-btn">
                              <FaRegFilePdf style={{ color: "white" }} />
                            </Button>
                          </a>
                        )}

                        {regulation.pdf_process ? (
                          <a target="_blank" href={regulation.pdf_process}>
                            <Button variant="primary" className="pdf-btn">
                              <FaRegFilePdf style={{ color: "white" }} />
                            </Button>
                          </a>
                        ) : (
                          // button inactivo para las normativas que no tengan pdf
                          <a target="_blank" disabled>
                            <Button
                              variant="secondary"
                              className="pdf-btn "
                              disabled
                            >
                              <FaRegFilePdf style={{ color: "white" }} />
                            </Button>
                          </a>
                        )}
                      </td>
                      {(userRole === "admin" || userRole === "asesor") && (
                        <td>
                          <Button
                            variant="secondary"
                            className="edit-btn"
                            onClick={() => handleEditClick(regulation.id)} // Usa la función de redirección
                          >
                            ✎
                          </Button>
                        </td>
                      )}
                      <td>
                        <Button variant="primary" className="detail-btn">
                          Detalles
                        </Button>
                      </td>
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

export default ListRegulations;
