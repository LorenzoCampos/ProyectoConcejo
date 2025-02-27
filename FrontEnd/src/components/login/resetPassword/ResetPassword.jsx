import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Toast, ToastContainer } from "react-bootstrap";
import axios from "axios"; // Importar axios
import API from "../../../config/apiConfig";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [password, setPassword] = useState(""); // Añadir estado para password
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Añadir estado para passwordConfirmation
  const { token } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  
  const email = searchParams.get("email"); // Obtener email de la URL

  useEffect(() => {
    console.log(token);
    console.log(email);

    if (!token || !email) {
      window.location.href = "/login";
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API.RESET_PASSWORD, {
        token: token,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      });

      if (response.status === 200) {
        setShowAlert(true);

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      }
    } catch (error) {
      console.log(error);
      setShowErrorToast(true);
      setToastMessage("Error al cambiar la contraseña!");
    }
  };
  
  return (
    <>
      <div className="content-page-container">
        <h1 className="internal-title">Restablecer Contraseña</h1>
        <div className="content-form">
          <p>Ingrese su nueva contraseña!</p>
          <Form onSubmit={handleResetPassword}>
            <Form.Group controlId="floatingPassword" className="mb-3">
              <Form.Control
                type="password"
                className="filter-input-border"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="floatingPasswordConfirmation" className="mb-3">
              <Form.Control
                type="password"
                className="filter-input-border"
                required
                placeholder="Confirmar Contraseña"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="primary" type="submit">
                Confirmar
              </Button>
            </div>
          </Form>
        </div>
        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>
              Se ha cambiado su contraseña.
            </Alert.Heading>
            <p>
              Ahora puede iniciar sesión con su nueva contraseña.
            </p>
            Redirigiendo a la página de inicio de sesión...
          </Alert>
        )}

        <ToastContainer position="top-end" className="p-3">
          <Toast
            bg="danger"
            onClose={() => setShowErrorToast(false)}
            show={showErrorToast}
            delay={5000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
}

export default ResetPassword;