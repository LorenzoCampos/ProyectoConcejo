import Button from 'react-bootstrap/Button';

import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();
  const closeSession = async () => {
    try {
      
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: "https://62pggsfv-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/logout",
        method: "POST",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);

      if (response.status === 200) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <>
      <Button variant="danger"
      onClick={closeSession}>Cerrar Sesión</Button>{' '}
    </>
  );
}

export default Logout;