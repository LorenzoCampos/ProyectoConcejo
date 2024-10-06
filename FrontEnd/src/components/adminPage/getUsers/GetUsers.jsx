import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./getUsers.css";

const API =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/all";

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
        url: `${API}`,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
    } catch (error) {
      let message = "Error al obtener los usuarios.";
      setToastMessage(message);
      setShowErrorToast(true);
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

      const response = await axios.post(
        `https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/role/${userId}`,
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
      <h1>Lista de usuarios</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role ? user.role : "Sin rol"}</td>
              <td>
                <Form.Group>
                  <Form.Control
                    className="form-select"
                    as="select"
                    value={selectedRole[user.id] || ""}
                    onChange={(e) => handleRoleChange(e, user.id)}
                  >
                    <option value="">---Cambiar Rol---</option>
                    <option value="secretario">Secretario</option>
                    <option value="concejal">Concejal</option>
                    <option value="cm">CM</option>
                    <option value="user">Usuario</option>
                  </Form.Control>
                </Form.Group>
              </td>
              <td className="td-button">
                <Button variant="primary" onClick={() => updateRole(user.id)}>
                  Editar Rol
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
