import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./login.css";

import { getDeviceId } from "./getDeviceId";

 const api = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/login"
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginData = async (e) => {
    e.preventDefault();


    try {
      const deviceId = getDeviceId();

      let headersList = {
        "Device-Id": deviceId,
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        email: email,
        password: password,
      });

      let reqOptions = {
        url: `${api}`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);
      console.log(response.data);

      // Obtiene el token de la respuesta
      const token = response.data.token;
      const role = response.data.role;

      // Almacena el token en el almacenamiento local
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);
      

    
      
      if (response.status === 200) {
        if (role === "admin") {
          console.log(role);
          navigate ("/admin");
        } else if (role === "concejal") {
          console.log(role);
          navigate("/concejal");
        } else if (role === "cm") {
          console.log(role);
          navigate("/cm");
        } else if (role === "secretario") {
          console.log(role);
          navigate("/secretario");
        } else {
          console.log(role);
          navigate("/");
        }
      }


    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado diferente a 2xx
        console.error("Datos de la respuesta de error:", error.response.data);
        console.error(
          "Estado de la respuesta de error:",
          error.response.status
        );
        console.error(
          "Encabezados de la respuesta de error:",
          error.response.headers
        );
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Solicitud de error:", error.request);
      } else {
        // Algo sucedió al configurar la solicitud
        console.error("Mensaje de error:", error.message);
      }
    }
  };

  return (
    <div className="content">
<div className="container">
      <div className="login-container">
        <h1>Bienvenido!</h1>
        <p>Iniciar sesión</p>
        <Form onSubmit={loginData}>
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder=""
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingPassword"
            label="Contraseña"
            className="mb-3"
          >
            <Form.Control
              type="password"
              placeholder=""
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </FloatingLabel>
          <div className="form-btn">
          <Button  variant="primary" type="submit">
            Ingresar
          </Button>
          </div>
          
        </Form>
      </div>
    </div>
    </div>
    
  );
}
export default Login;
