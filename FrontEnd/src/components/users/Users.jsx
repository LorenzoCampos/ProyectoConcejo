import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


import axios from "axios";

function Users() {

  const [users, setUserss] = useState([]);

  const getAlluserss = async () => {
    try {
      const response = await axios.get("https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/userss");
      setuserss(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }

  return (
    <div className="container">
      <div className="userss-container">
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
            {users.map((users) => (
              <tr key={users.id}>
                <td>{users.id}</td>
                <td>{users.name}</td>
                <td>{users.email}</td>
                <td>{users.role}</td>
                <td>
                  <Button variant="primary">Editar </Button>
                </td>
              </tr>
            ))}
          </th>
        </table>
      </div>
    </div>
  );

}

export default Users;