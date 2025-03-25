import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import axios from "axios";
import API from "../../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import "./orderDay.css";

function LoadOrderDay() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState({});
  const [sessionDate, setSessionDate] = useState("");
  const [actaNumber, setActaNumber] = useState("");

  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [inputValues, setInputValues] = useState({});
  const [lists, setLists] = useState({
    5: [],
    6: [],
    7: [],
    8: [],
  });

  const navigate = useNavigate();

  const handleAddItem = (index) => {
    if (inputValues[index]?.trim() !== "") {
      setLists({
        ...lists,
        [index]: [...lists[index], inputValues[index]],
      });
      setInputValues({ ...inputValues, [index]: "" });
    }
  };

  const handleRemoveItem = (index, itemIndex) => {
    setLists({
      ...lists,
      [index]: lists[index].filter((_, i) => i !== itemIndex),
    });
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setLoading(true);
  };

  useEffect(() => {
    if (startDate === "" && endDate === "" && loading === true) {
      handleSearch();
    }
  }, [startDate, endDate, loading]);

  const handleSearch = async () => {
    setLoading(true);
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
      setToastMessage("Error en la busqueda.");
      setShowErrorToast(true);
      console.error(error);
    } finally {
      setLoading(false);
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
        date: sessionDate,
        acta: actaNumber,
        correspondence: Object.keys(selectedItems.correspondence).filter(
          (id) => selectedItems.correspondence[id]
        ),
        dem_message: Object.keys(selectedItems.dem_message).filter(
          (id) => selectedItems.dem_message[id]
        ),
        projects: Object.keys(selectedItems.projects).filter(
          (id) => selectedItems.projects[id]
        ),
        comision_gobierno: lists[5],
        comision_hacienda: lists[6],
        comision_obras: lists[7],
        comision_higiene: lists[8],
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
        window.scrollTo(0, 0); // Desplazar hacia arriba
        setTimeout(() => {
          navigate("/ver-orden-dia"); // Recargar la página
        }, 1500);

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

        <div className="page-results-cont">
          <div className="page-results">
            {loading ? (
              <>
                <div className="loading-circle">
                  <Spinner animation="border" role="status" size="md">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <>
                <Form className="manual-data">
                  <Form.Group className="manual-data__item">
                    <h5>SESIÓN ORDINARIA:</h5>
                    <Form.Control
                      type="date"
                      value={sessionDate}
                      placeholder="Ingrese la sesión ordinaria"
                      date_format="dd/mm/yyyy"
                      onChange={(e) => setSessionDate(e.target.value)}
                      // name="date"
                    />
                  </Form.Group>
                  <Form.Group className="manual-data__item">
                    <h5>1. Aprobacion del acta anterior: N° </h5>
                    <Form.Control
                      type="text"
                      value={actaNumber}
                      placeholder="Ingrese el número del acta anterior"
                      onChange={(e) => setActaNumber(e.target.value)}
                      // name="acta"
                    />
                  </Form.Group>
                </Form>

                {data.correspondence?.length > 0 ||
                data.dem_message?.length > 0 ||
                data.projects?.length > 0 ? (
                  <>
                    {data.correspondence && data.correspondence.length > 0 ? (
                      <>
                        <div className="sections">
                          <h5 className="h5-underline">
                            2. Correspondencias recibidas:
                          </h5>
                          <div className="items-list">
                            {data.correspondence.map((item) => (
                              <div key={item.id} className="item">
                                <div>
                                  {item.authors
                                    .map((author) => author.name)
                                    .join(", ")}
                                  {": "}
                                  {item.subject}
                                  {". "}
                                  (Cargo N° {item.number})
                                </div>
                                <div className="checkbox-cell">
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={
                                      selectedItems.correspondence[item.id] ||
                                      false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        "correspondence",
                                        item.id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No hay correspondencias</p>
                    )}

                    {data.dem_message && data.dem_message.length > 0 ? (
                      <>
                        <div className="sections">
                          <h5 className="h5-underline">3. Mensajes del DEM:</h5>
                          <div className="items-list">
                            {data.dem_message.map((item) => (
                              <div key={item.id} className="item">
                                <div>
                                  {item.subject}
                                  {". "}
                                  (Cargo N° {item.number})
                                </div>
                                <div className="checkbox-cell">
                                  <input
                                    className="custom-checkbox"
                                    type="checkbox"
                                    checked={
                                      selectedItems.dem_message[item.id] ||
                                      false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        "dem_message",
                                        item.id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No hay Mensajes del DEM</p>
                    )}

                    {data.projects && data.projects.length > 0 ? (
                      <>
                        <div className="sections">
                          <h5 className="h5-underline">
                            4. PROYECTOS DE LOS SEÑORES CONCEJALES:
                          </h5>
                          <div className="items-list">
                            {data.projects.map((item) => (
                              <div key={item.id} className="item">
                                <div>
                                  {translateType(item.type)}
                                  {": "}
                                  {item.subject}
                                  {". "}
                                  {item.authors
                                    .map((author) => author.name)
                                    .join(", ")}
                                  {". "}
                                  (Cargo N°{item.number})
                                </div>
                                <div className="checkbox-cell">
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={
                                      selectedItems.projects[item.id] || false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange("projects", item.id)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No hay proyectos de los señores concejales</p>
                    )}

                    {[5, 6, 7, 8].map((index) => (
                      <>
                        <Form.Group key={index}>
                          {index === 5 ? (
                            <h5 className="h5_underline">
                              5. DESPACHO DE LA COMISIÓN DE GOBIERNO:
                            </h5>
                          ) : null}
                          {index === 6 ? (
                            <h5 className="h5_underline">
                              6. DESPACHO DE LA COMISIÓN DE HACIENDA:
                            </h5>
                          ) : null}
                          {index === 7 ? (
                            <h5 className="h5_underline">
                              7. DESPACHO DE LA COMISIÓN DE OBRAS PÚBLICAS:
                            </h5>
                          ) : null}
                          {index === 8 ? (
                            <h5 className="h5_underline">
                              8. DESPACHO DE LA COMISIÓN DE HIGIENE:
                            </h5>
                          ) : null}
                          <div className="cont-lista-despachos">
                            <div className="lista-despacho">
                              <Form.Control
                                type="text"
                                placeholder=" Detallar despacho..."
                                value={inputValues[index] || ""}
                                onChange={(e) =>
                                  setInputValues({
                                    ...inputValues,
                                    [index]: e.target.value,
                                  })
                                }
                              />
                              <Button
                                variant="primary"
                                onClick={() => handleAddItem(index)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <ListGroup className="mt-3">
                            {lists[index].map((item, i) => (
                              <ListGroup.Item key={i} className="lista-item">
                                {item}
                                <Button
                                  className="lista-item-button"
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleRemoveItem(index, i)}
                                >
                                  ❌
                                </Button>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Form.Group>
                      </>
                    ))}
                    <div className="cont-button-orden-dia">
                      <Form onSubmit={handleSubmit}>
                        <Button variant="primary" type="submit">
                          Cargar orden del día
                        </Button>
                      </Form>
                    </div>
                  </>
                ) : (
                  <>
                    <p>No hay datos disponibles.</p>
                    <Spinner animation="border" role="status" size="md">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                )}
              </>
            )}
          </div>
        </div>
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
