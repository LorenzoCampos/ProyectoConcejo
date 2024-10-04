import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./register.css";

const api = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/register";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const registerData = async (e) => {
    e.preventDefault();

    try {
      let headersList = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("authToken"),
      };

      let bodyContent = JSON.stringify({
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        role: role,
      });

      let reqOptions = {
        url: `${api}`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);

      if (response.status === 201) {
        navigate("/login"); // Home
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
    <div className="container">
      <div className="register-container">
        <h1>Registrar Usuario</h1>
        <Form onSubmit={registerData}>
          <FloatingLabel controlId="floatingInput" label="Nombre y Apellido" className="mb-3">
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
            />
          </FloatingLabel>

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
              
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingPassword"
            label="Contraseña"
            className="mb-3"
          >
            <Form.Control
              type="password"
             
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Confirmar Contraseña"
            className="mb-3"
          >
            <Form.Control
              type="password"
             
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </FloatingLabel>

          <FloatingLabel 
            controlId="floatingInput" 
            label="Rol:" 
            className="mb-3"
          >
            <Form.Select aria-label="Default select example"
              onChange={(event) => setRole(event.target.value)}
              required
            >
              <option>---seleccione el rol---</option>
              <option value="admin">Administrador</option>
              <option value="secretario">Secretario</option>
              <option value="concejal">Concejal</option>
              <option value="cm">CM</option>
              <option value="user">Usuario</option>
            </Form.Select>
            
            
          </FloatingLabel>

          <div className="form-btn">
          <Button variant="primary" type="submit">
            Registrar 
          </Button>
            </div>
        </Form>
      </div>
    </div>
  );
}
export default Register;
