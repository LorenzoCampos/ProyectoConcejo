import Button from 'react-bootstrap/Button';
import "./logout.css"

import axios from 'axios';
import { useNavigate } from "react-router-dom";
const API = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/logout";

function Logout() {

  const navigate = useNavigate();
  const closeSession = async () => {
    try {
      
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: `${API}`,
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
      <Button className='form-btn' variant="primary" 
      onClick={closeSession}>Cerrar Sesión</Button>{' '}
    </>
  );
}

export default Logout;