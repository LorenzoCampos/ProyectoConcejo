import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./login.css";
import API from "../../config/apiConfig";

import { getDeviceId } from "./getDeviceId";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
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
        url: API.LOGIN,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);

      // Obtiene el token de la respuesta
      const token = response.data.token;
      const role = response.data.role;
      const name = response.data.user.name;

      console.log(name);

      // Almacena el token en el almacenamiento local
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", name);

      if (response.status === 200) {
        if (role === "admin") {
          console.log(role);
          navigate("/admin");
        } else if (role === "concejal") {
          console.log(role);
          navigate("/asesor-concejal");
        } else if (role === "cm") {
          console.log(role);
          navigate("/cm");
        } else if (role === "asesor") {
          console.log(role);
          navigate("/asesor-concejal");
        } else {
          console.log(role);
          navigate("/");
        }
      }
    } catch (error) {
      let message = "Error desconocido.";
      if (error.response) {
        if (error.response.status === 401) {
          // Credenciales incorrectas
          let message = "Email o contraseña incorrectos.";
          setToastMessage(message);
          setShowWarningToast(true); // Mostrar toast de advertencia
        } else {
          // Otro tipo de error
          message = `Error ${error.response.status}: ${
            error.response.data.message || "Datos inválidos"
          }`;
          setToastMessage(message);
          setShowErrorToast(true); // Mostrar toast de error general
        }
      } else if (error.request) {
        message = "No se recibió respuesta del servidor.";
        setToastMessage(message);
        setShowErrorToast(true);
      } else {
        message = "Error al realizar la solicitud.";
        setToastMessage(message);
        setShowErrorToast(true);
      }
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="login-container">
          <h1>Bienvenido!</h1>
          <p>Inicie sesión</p>
          <div className="form-cont">
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
                <Button variant="primary" type="submit">
                  Ingresar
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {/* Toast de error de servidor */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Toast de advertencia para credenciales incorrectas */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowWarningToast(false)}
          show={showWarningToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
export default Login;
