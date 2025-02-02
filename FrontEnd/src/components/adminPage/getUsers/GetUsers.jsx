import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./getUsers.css";

import API from "../../../config/apiConfig";

function GetUsers() {
  const [data, setData] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

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
        url: API.LIST_USERS,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);

      setData(response.data);

      console.log(response.data);
    } catch (error) {
      if (error.response) {
        let message = "Error al obtener los usuarios.";
        setToastMessage(message);
        setShowErrorToast(true);
      }
    }
  };

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
      setToastMessage(message);
      setShowSuccessToast(true);

      // Actualizar el rol en la tabla
      getAlldata();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  return (
    <div className="user-container">
      <h1 className="title-text">Lista de usuarios</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Roles</th>
            <th>Cambiar rol</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role ? user.role : "Sin rol"}</td>
              <td className="td-actions">
                <Form.Group>
                  <Form.Control
                    className="form-select"
                    as="select"
                    value={selectedRole[user.id] || ""}
                    onChange={(e) => handleRoleChange(e, user.id)}
                  >
                    <option value="">---Seleccionar un rol---</option>
                    <option value="asesor">Asesor</option>
                    <option value="mesa de entrada">Mesa de Entrada</option>
                    <option value="concejal">Concejal</option>
                    <option value="cm">CM</option>
                    <option value="user">Usuario</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={() => updateRole(user.id)}>
                  Guardar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
  );
}

export default GetUsers;
