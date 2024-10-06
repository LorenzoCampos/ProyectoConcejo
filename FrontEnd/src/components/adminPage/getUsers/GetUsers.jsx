import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
<<<<<<< HEAD

import axios from "axios";
const API =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/login";
const API_ROLE =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/role";

function GetUsers() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    getAlldata();
  });
=======
import axios from "axios";
import "./getUsers.css";

const api = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/all";

function GetUsers() {
  const [data, setData] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  useEffect(() => {
    getAlldata();
  }, []);
>>>>>>> 623463be548ea2b3912556553489eeada96b9eae

  const getAlldata = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      /*       let bodyContent = JSON.stringify({
      }); */

      let reqOptions = {
<<<<<<< HEAD
        url: `${API}`,
=======
        url: api,
>>>>>>> 623463be548ea2b3912556553489eeada96b9eae
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
<<<<<<< HEAD

    const editRole = async (e) => {
      e.preventDefault();
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "application/json",
        };

        let bodyContent = JSON.stringify({
          role: role,
        });

        let reqOptions = {
          url: `${API_ROLE}`,
          method: "POST",
          headers: headersList,
          data: bodyContent,
        };

        const response = await axios.request(reqOptions);

        if (response.status === 200) {
          getAlldata();
          console.log("Rol cambiado exitosamente:", response.data);

          /* Funcion para deslogear a los usuarios con su rol cambiado */

          /* if (response.data.role === "admin") {
            localStorage.removeItem("authToken");
            window.location.reload();
          } */
        } else {
          console.error("Error al cambiar el rol:", response.data);
        }
      } catch (error) {
        console.error("Error al cambiar el rol:", error);
      }
    };

    return (
      <div className="container">
        <div className="datas-container">
          <h1>Lista de usuarios</h1>
          <table>
            <th>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Role</th>
                <th>Acciones</th>
              </tr>
            </th>

            <th>
              {data.map((data) => (
                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>
                    <Form onSubmit={editRole}>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(event) => setRole(event.target.value)}
                      >
                        <div>
                          <option> ---Cambiar Rol--- </option>
                          <option value="admin">Administrador</option>
                          <option value="secretario">Secretario</option>
                          <option value="concejal">Concejal</option>
                          <option value="cm">CM</option>
                          <option value="user">Usuario</option>
                        </div>
                      </Form.Select>
                      <td>
                        <Button variant="primary" type="submit">
                          Editar Rol
                        </Button>
                      </td>
                    </Form>
                  </td>
                </tr>
              ))}
            </th>
          </table>
        </div>
      </div>
    );
=======
>>>>>>> 623463be548ea2b3912556553489eeada96b9eae
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
