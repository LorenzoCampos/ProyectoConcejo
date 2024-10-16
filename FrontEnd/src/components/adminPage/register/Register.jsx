import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState } from "react";

import axios from "axios";
import "./register.css";

const API =
  "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/register";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const registerData = async (e) => {
    e.preventDefault();

    try {
      let headersList = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      };

      let bodyContent = JSON.stringify({
        name: name,
        email: email,
        email_confirmation: emailConfirmation,
        password: password,
        password_confirmation: passwordConfirmation,
        role: role,
      });

      let reqOptions = {
        url: `${API}`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);

      if (response.status === 201) {

        let message = "Usuario registrado correctamente.";
        setToastMessage(message);
        setShowSuccessToast(true);
      }
    } catch (error) {
      if (error.response) {
        // La solicitud fue hecha y el servidor respondio con un error
        console.error(
          "Estado de la respuesta de error:",
          error.response.status
        );

        console.error(
          "Encabezados de la respuesta de error:",
          error.response.headers
        );

        if (error.response.status === 422) {
          // Errores de validación
          let message = error.response.data.message;
          setToastMessage(message);
          setShowErrorToast(true);

          if (error.response.data.errors.email) {
            // Error de email
            let message = error.response.data.errors.email;
            setToastMessage(message);
            setShowErrorToast(true);
          }
          if (error.response.data.errors.email_confirmation) {
            // Error de email_confirmation
            let message = error.response.data.errors.email_confirmation;
            setToastMessage(message);
            setShowErrorToast(true);
          }
          if (error.response.data.errors.password) {
            // Error de password
            let message = error.response.data.errors.password;
            setToastMessage(message);
            setShowErrorToast(true);
          }
        }
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
          <FloatingLabel
            controlId="floatingInput"
            label="Nombre y Apellido"
            className="mb-3"
          >
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
            controlId="floatingInput"
            label="Confirmar Mail"
            className="mb-3"
          >
            <Form.Control
              type="email"
              value={emailConfirmation}
              onChange={(event) => setEmailConfirmation(event.target.value)}
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
            <Form.Select
              aria-label="Default select example"
              className="form-select"
              onChange={(event) => setRole(event.target.value)}
              required
            >
              <option> ---Seleccione el rol--- </option>
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

      <div>
        {/* Toast alerta */}
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

        {/* Toast exito */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            bg="success"
            onClose={() => setShowSuccessToast(false)}
            show={showSuccessToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>

    </div>
  );
}
export default Register;