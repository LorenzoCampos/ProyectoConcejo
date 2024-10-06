import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";
import "./getUsers.css";

const api = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/all";

function GetUsers() {
  const [data, setData] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  useEffect(() => {
    getAlldata();
  }, []);

  const getAlldata = async () => {
    try {
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: api,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
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
      alert("Por favor selecciona un rol.");
      return;
    }

    try {
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
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

      console.log(response.data);

      alert(`Rol actualizado a ${newRole} para el usuario con ID ${userId}`);
      getAlldata();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  return (
    <div className="container">
      <h1>Lista de usuarios</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role ? user.role : "Sin rol"}</td>
              <td>
                <Form.Group>
                  <Form.Control
                    as="select"
                    value={selectedRole[user.id] || ""}
                    onChange={(e) => handleRoleChange(e, user.id)}
                  >
                    <option value="">---Cambiar Rol---</option>
                    <option value="User">User</option>
                    <option value="Secretario">Secretario</option>
                    <option value="Concejal">Concejal</option>
                    <option value="cm">Redes</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={() => updateRole(user.id)}>
                  Editar Rol
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetUsers;
