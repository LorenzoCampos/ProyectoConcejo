import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./listUsers.css";

import API from "../../../config/apiConfig";

function ListUsers() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedRole, setSelectedRole] = useState({});

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    getAlldata();
  }, []);

  // Start Obtener Users

  const getAlldata = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.LIST_USERS,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);

      setData(response.data);
      setFilteredData(response.data);

      console.log(response.data);
    } catch (error) {
      if (error.response) {
        let message = "Error al obtener los usuarios.";
        setToastMessage(message);
        setShowErrorToast(true);
      }
    }
  };

  // End Obtener Users

  // Start Modificar User

  const handleRoleChange = (e, userId) => {
    setSelectedRole({
      ...selectedRole,
      [userId]: e.target.value,
    });
  };

  const updateRole = async (userId) => {
    const newRole = selectedRole[userId];
    if (!newRole) {
      let message = "Por favor selecciona un rol.";
      setToastMessage(message);
      setShowWarningToast(true);
      return;
    }

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        role: newRole,
      });

      const response = await axios.patch(
        API.UPDATE_ROLE.replace("userId", userId),
        bodyContent,
        { headers: headersList }
      );

      let message = `Rol actualizado a ${newRole} correctamente.`;

      if (response.status === 200) {
        setToastMessage(message);
        setShowSuccessToast(true);
      } else {
        setToastMessage("Error al actualizar el rol.");
        setShowErrorToast(true);
      }

      // Actualizar el rol en la tabla
      getAlldata();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  // End Modificar User

  // Start Filtro de Users

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterStatus(selectedFilter);

    switch (selectedFilter) {
      case "asesor":
        setFilteredData(data.filter((user) => user.role === "asesor"));
        break;
      case "mesa":
        setFilteredData(data.filter((user) => user.role === "mesa"));
        break;
      case "concejal":
        setFilteredData(data.filter((user) => user.role === "concejal"));
        break;
      case "cm":
        setFilteredData(data.filter((user) => user.role === "cm"));
        break;
      case "user":
        setFilteredData(data.filter((user) => user.role === "user"));
        break;
      default:
        setFilteredData(data);
    }
  };

  const handleTranslateRole = (role) => {
    switch (role) {
      case "asesor":
        return "Asesor";
      case "mesa":
        return "Mesa de Entrada";
      case "concejal":
        return "Concejal";
      case "cm":
        return "Redes";
      case "user":
        return "Usuario";
      default:
        return "Sin rol";
    }
  };

  // End Filtro de Users

  return (
    <div className="page-table">
      <div className="content-page-container">
        <h1 className="internal-title">Lista de usuarios</h1>
        <div className="filter-regulations">
          <div className="filter-inputs">
            <div className="filter-group">
              <Form.Label>Rol:</Form.Label>
              <Form.Select
                aria-label="Filtrar por rol"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="">Filtrar por rol</option>
                <option value="asesor">Asesor</option>
                <option value="mesa">Mesa de Entrada</option>
                <option value="concejal">Concejal</option>
                <option value="cm">Redes</option>
                <option value="user">Usuario</option>
              </Form.Select>
            </div>
          </div>
          <div>
            <Button
              className="btn-banner"
              as={Link}
              to="/admin/registrar-usuario"
            >
              Registrar nuevo usuario
            </Button>
          </div>
        </div>
        <div className="content-table">
          <table className="content-table__table">
            <thead>
              <tr>
                <th>Nombre y Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user) => (
                <tr key={user.id}>
                  <td data-title="Nombre">
                    {(user.name ? user.name : "-") +
                      " " +
                      (user.last_name ? user.last_name : "-")}
                  </td>
                  <td data-title="Email">{user.email}</td>
                  <td data-title="Rol">{handleTranslateRole(user.role)}</td>
                  <td data-title="Cambiar rol">
                    <div className="accion-buttons ">
                      <div>
                        <Form.Group>
                          <Form.Control
                            className="form-select"
                            as="select"
                            value={selectedRole[user.id] || ""}
                            onChange={(e) => handleRoleChange(e, user.id)}
                          >
                            <option value="">---Seleccionar un rol---</option>
                            <option value="asesor">Asesor</option>
                            <option value="mesa">Mesa de Entrada</option>
                            <option value="concejal">Concejal</option>
                            <option value="cm">Redes</option>
                            <option value="user">Usuario</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div>
                        <Button
                          variant="primary"
                          onClick={() => updateRole(user.id)}
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
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

          {/* Toast advertencia */}
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
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
