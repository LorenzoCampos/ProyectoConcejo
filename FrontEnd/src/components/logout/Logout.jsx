import Button from 'react-bootstrap/Button';
import "./logout.css"

import axios from 'axios';
import { useNavigate } from "react-router-dom";

import API from "../../config/apiConfig";
function Logout() {

  const navigate = useNavigate();
  const closeSession = async () => {
    try {
      
      let headersList = {
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.LOGOUT,
        method: "POST",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);

      if (response.status === 200) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }

    } catch (error) {
      if (response.status === 404) {
        localStorage.removeItem("authToken");
      } 

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