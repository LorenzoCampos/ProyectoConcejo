import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import{useState, useEffect} from  "react";

import axios from "axios";


function Getdata() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    getAlldata();
  }, );

  const getAlldata = async () => {
    try {
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/user/all",
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setdata(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }

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
                    <Form>
                      <div>
                        <option value="---Cambiar Rol---"></option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>...
                      </div>
                      
                      <Button  variant="primary">Editar Rol</Button>
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

export default Getdata;
