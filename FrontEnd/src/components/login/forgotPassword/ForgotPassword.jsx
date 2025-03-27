import React from "react";
import { useState } from "react";
import {Form} from "react-bootstrap";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import API from "../../../config/apiConfig";
import axios from "axios";


function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);


  const handleForgotFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API.FORGOT_PASSWORD, {
        email: email,
      });

      if (response.status === 200) {
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error);
      setShowErrorToast(true);
      setToastMessage("Error al enviar el email de reestablecimiento de contraseña!");
    }
  };

  return (
    <>
      <div className="page-home">
        <div className="content-page-container">
        <h1 className="internal-title">Restablecer Contraseña</h1>
          <div className="content-form">
            
            <p>Ingrese su email para reestablecer su contraseña!</p>
            <Form>
              <Form.Group controlId="floatingInput" className="mb-3">
                <Form.Control
                  type="email"
                  className="filter-input-border"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-3 justify-content-center">
                <Button variant="primary" href="/login">
                  Volver
                </Button>

                <Button variant="primary" onClick={handleForgotFormSubmit}>
                  Siguiente
                </Button>
              </div>
            </Form> 
          </div>
            {showAlert && (
              <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Se ha enviado un enlace a tu correo electronico.</Alert.Heading>
                <p>Por favor revise su bandeja de entrada para restablecer su contraseña.</p>
              </Alert>
            )}
        </div>
      </div>

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
    </>
  );
}

export default ForgotPassword;
