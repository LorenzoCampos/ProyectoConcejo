import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState } from "react";

import axios from "axios";
import "./register.css";

import API from "../../../config/apiConfig";

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
        url: API.CREATE_USERS,
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
    <div className="page-form">
      <div className="content-page-container">
        <h1 className="internal-title">Registrar Usuario</h1>
        <div className="content-form">
          <Form onSubmit={registerData}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre y apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre y apellido"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmEmail" className="mb-3">
              <Form.Label>Confirmar Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirmar Email"
                value={emailConfirmation}
                onChange={(event) => setEmailConfirmation(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmar Contraseña"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formRol" className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                aria-label="Default select example"
                className="form-select"
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="">---Seleccionar un rol---</option>
                <option value="asesor">Asesor</option>
                <option value="mesa de entrada">Mesa de Entrada</option>
                <option value="concejal">Concejal</option>
                <option value="cm">CM</option>
                <option value="user">Usuario</option>
              </Form.Select>
            </Form.Group>

            <div className="form-btn register-btn">
              <Button variant="primary" type="submit">
                Registrar
              </Button>
            </div>
          </Form>
        </div>
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
