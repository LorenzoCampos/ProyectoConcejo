import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import axios from "axios";
import API from "../../../config/apiConfig";
import "./orderDay.css";

function LoadOrderDay() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(API.GET_ORDERS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      if (response.status === 200) {
        setData(response.data);
        setSelectedItems({
          correspondence: response.data.correspondence.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {}),

          dem_message: response.data.dem_message.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {}),

          projects: response.data.projects.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {}),
        });
      }
    } catch (error) {
      setToastMessage("Error al cargar");
      setShowErrorToast(true);
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const typeTranslations = {
    ordinance: "Ordenanza",
    resolution: "Resolución",
    minutes: "Minutas",
    decree: "Decreto",
    declaration: "Declaración",
    correspondence: "Correspondencia",
    "dem-message": "Mensaje del DEM",
  };

  function translateType(type) {
    return typeTranslations[type] || type; // Si no hay traducción, muestra el valor original
  }

  const handleCheckboxChange = (type, id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Items: ", selectedItems);
    try {
      const selectedData = {
        correspondence: Object.keys(selectedItems.correspondence).filter(
          (id) => selectedItems.correspondence[id]
        ),
        dem_message: Object.keys(selectedItems.dem_message).filter(
          (id) => selectedItems.dem_message[id]
        ),
        projects: Object.keys(selectedItems.projects).filter(
          (id) => selectedItems.projects[id]
        ),
      };

      const response = await axios.post(API.GET_ORDERS, selectedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setToastMessage("Orden del día cargada exitosamente.");
        setShowSuccessToast(true);
        console.log("Respuesta: ", response.data);
      }
    } catch (error) {
      setToastMessage("Error al cargar la orden del día.");
      setShowErrorToast(true);
      console.error("Error al cargar la orden del día:", error);
    }
  };

  return (
    <div className="page-form">
      <div className="content-page-container">
        <h1 className="internal-title">Cargar Orden del Día</h1>
        <Form className="filter-regulations">
          <Form.Group className="filter-inputs" controlId="formFile">
            <div className="filter-group">
              <Form.Label>Desde:</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <Form.Label>Hasta:</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group className="filter-buttons">
            <Button variant="dark" onClick={handleClearFilters}>
              Limpiar
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                handleSearch();
              }}
            >
              Filtrar
            </Button>
          </Form.Group>
        </Form>
        {data.correspondence?.length > 0 ||
        data.dem_message?.length > 0 ||
        data.projects?.length > 0 ? (
          <>
            {data.correspondence && data.correspondence.length > 0 ? (
              <>
                <h3>Correspondencias recibidas:</h3>
                <Table striped bordered hover>
                  <tbody>
                    {data.correspondence.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.authors.map((author) => author.name).join(", ")}
                          {": "}
                          {item.subject}
                          {". "}
                          (Cargo N° {item.number})
                        </td>
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={
                              selectedItems.correspondence[item.id] || false
                            }
                            onChange={() =>
                              handleCheckboxChange("correspondence", item.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <p>No hay correspondencias</p>
            )}

            {data.dem_message && data.dem_message.length > 0 ? (
              <>
                <h3>Mensajes del DEM:</h3>
                <Table striped bordered hover>
                  <tbody>
                    {data.dem_message.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.subject}
                          {". "}
                          (Cargo N° {item.number})
                        </td>
                        <td className="checkbox-cell">
                          <input
                            className="custom-checkbox"
                            type="checkbox"
                            checked={
                              selectedItems.dem_message[item.id] || false
                            }
                            onChange={() =>
                              handleCheckboxChange("dem_message", item.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <p>No hay Mensajes del DEM</p>
            )}

            {data.projects && data.projects.length > 0 ? (
              <>
                <h3>Proyectos de los señores concejales:</h3>
                <Table striped bordered hover>
                  <tbody>
                    {data.projects.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {translateType(item.type)}
                          {": "}
                          {item.subject}
                          {". "}
                          {item.authors.map((author) => author.name).join(", ")}
                          {". "}
                          (Cargo N°{item.number})
                        </td>
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={selectedItems.projects[item.id] || false}
                            onChange={() =>
                              handleCheckboxChange("projects", item.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <p>No hay proyectos de los señores concejales</p>
            )}

            <Form onSubmit={handleSubmit}>
              <Button variant="primary" type="submit">
                Cargar orden del día
              </Button>
            </Form>
          </>
        ) : (
          <>
            <Spinner animation="border" role="status" size="md">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </>
        )}

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

export default LoadOrderDay;
