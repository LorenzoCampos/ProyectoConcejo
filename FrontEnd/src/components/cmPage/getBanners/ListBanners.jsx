import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState, useEffect } from "react";
import axios from "axios";
import "./getBanners.css";

const API =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/v1/banners";

function ListBanners() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [filterStatus, setFilterStatus] = useState(""); // Estado del filtro
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
        url: `${API}`,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
      setFilteredData(response.data); // Mostrar todos los datos inicialmente
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al obtener los banners.");
        setShowErrorToast(true);
      }
    }
  };

  const handleStateChange = (e, bannerId) => {
    setSelectedState({
      ...selectedState,
      [bannerId]: e.target.value,
    });
  };

  const updateState = async (bannerId) => {
    const newState = selectedState[bannerId];
    if (!newState) {
      setToastMessage("Por favor selecciona un estado.");
      setShowWarningToast(true);
      return;
    }

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        status: newState === "Activo" ? 1 : 0,
      });

      const response = await axios.patch(
        `https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/v1/news-banners/${bannerId}`,
        bodyContent,
        { headers: headersList }
      );

      setToastMessage(`Estado actualizado a ${newState} correctamente.`);
      setShowSuccessToast(true);

      getAlldata(); // Refrescar la lista después de actualizar el estado
    } catch (error) {
      setToastMessage("Error al actualizar el estado.");
      setShowErrorToast(true);
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

        const response = await axios.delete(
          `https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/v1/news-banners/${bannerId}`,
          { headers: headersList }
        );
        setToastMessage("Banner eliminado correctamente.");
        setShowSuccessToast(true);
        getAlldata(); // Refrescar la lista
      } catch (error) {
        setToastMessage("Error al eliminar el banner.");
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
    <div className="banner-container">
      <h1>Lista de Banners</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th className="status-filter">
              Estado:
              <Form.Select
                aria-label="Filtrar por estado"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Form.Select>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((banner) => (
            <tr key={banner.id}>
              <td>
                <img
                  src={banner.image}
                  alt="banner"
                  style={{ width: "100px" }}
                />
              </td>
              <td>{banner.status === 1 ? "Activo" : "Inactivo"}</td>
              <td>
                <Form.Group>
                  <Form.Select
                    className="me-2"
                    as="select"
                    value={selectedState[banner.id] || ""}
                    onChange={(e) => handleStateChange(e, banner.id)}
                  >
                    <option value="">--- Cambiar Estado ---</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td className="td-button">
                <Button
                  className="me-2"
                  variant="primary"
                  onClick={() => updateState(banner.id)}
                >
                  Editar estado
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
