import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./login.css";
import API from "../../config/apiConfig";

import { getDeviceId } from "./getDeviceId";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  const [showPassword, setShowPassword] = useState(false); 

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      const email_verified = response.data.user.email_verified;

      console.log(name);

      // Almacena el token en el almacenamiento local
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", name);
      localStorage.setItem("email_verified", email_verified);

      console.log(localStorage.getItem("email_verified"));

      if (response.status === 200) {
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "concejal":
            navigate("/asesor-concejal");
            break;
          case "asesor":
            navigate("/asesor-concejal");
            break;
          case "mesa de entrada":
            navigate("/asesor-concejal");
            break;
          case "cm":
            navigate("/cm");
            break;
          default:
            navigate("/");
            break;
        }
      }
    } catch (error) {
      console.log(error);
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
    <div className="page-form">
      <div className="content-page-container">
      <div className="content-form">
        <h1 className="internal-title login-title">Inicie sesión</h1>
          <Form onSubmit={loginData}>
          <Form.Group controlId="floatingInput" className="mb-3">
              
              <Form.Control
                type="email"
                className="filter-input-border"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group controlId="floatingPassword" className="mb-3">
              
              <div className="password-container">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className="filter-input-border"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={passwordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              </Form.Group>
          { /* <FloatingLabel
              controlId="floatingPassword"
              label="Contraseña"
              className="mb-3"
            >
              <Form.Control
                type="password"
                className="filter-input-border"
                placeholder=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </FloatingLabel>*/}
            <div className="form-btn">
              <Button variant="primary" type="submit">
                Ingresar
              </Button>
            </div>
          </Form>
        </div>
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </div>

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
