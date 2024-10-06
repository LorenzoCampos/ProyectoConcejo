import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

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

  const getAlldata = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      /*       let bodyContent = JSON.stringify({
      }); */

      let reqOptions = {
        url: `${API}`,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }

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
  };
}

export default GetUsers;
