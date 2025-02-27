import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import NavbarForRole from "../navbar/NavbarForRole";

import { Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";

import axios from "axios";
import API from "../../config/apiConfig";

function Profile() {
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(API.USER_DATA, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        });

        if (response.status === 200) {
          /* console.log(response.data); */
          const userData = response.data;
          setUserName(userData.user.name);
          setUserLastName(userData.user.last_name);
          setUserEmail(userData.user.email);
          setUserRole(userData.role);
          setEmailVerified(userData.email_verified);
          // Campos de edicion
          setEditName(userData.user.name);
          setEditLastName(userData.user.last_name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    //     "user": {
    //         "name": "Admin",
    //         "last_name": null,
    //         "email": "admin@email.com",
    //         }
    //     "role": "admin",
    //     "email_verified": true
    // }

    fetchUserData();
  }, [localStorage.getItem("authToken")]);

  const handleEditProfile = async (e) => {
    if (!editName && !editLastName) {
      setToastMessage("Debes ingresar al menos un nombre o apellido para actualizar el perfil.");
      setShowWarningToast(true);
      return;
    }

    try {
      const response = await axios.post(
        API.EDIT_PROFILE,
        {
          name: editName,
          last_name: editLastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );

      if (response.status === 200) {
        /* console.log(response.data); */
        setUserName(editName);
        setUserLastName(editLastName);
        setShowModal(false);
        setShowSuccessToast(true);
        setToastMessage("Perfil actualizado correctamente.");
      }
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
      setToastMessage("Error al actualizar el perfil.");
    }
  };

  return (
    <>
      <Navbar />
      <NavbarForRole />
      <div className="page-home">
        <div className="content-page-container">
          <h1 className="internal-title">Perfil</h1>
          <div className="content-form">
            <div>
              <p>Nombre: {userName}</p>
              <p>Apellido: {userLastName ? userLastName : "-"} </p>
              <p>Email: {userEmail}</p>
              <p>Rol: {userRole}</p>
              <p>Email verificado: {emailVerified ? "Sí" : "No"}</p>
            </div>
          </div>
          <div>
            <Button onClick={() => setShowModal(true)}>Editar perfil</Button>
          </div>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su apellido"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={(() => setShowModal(false), handleEditProfile)}
              disabled={!editName && !editLastName}
            >
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>

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

          <Toast
            bg="danger"
            onClose={() => setShowErrorToast(false)}
            show={showErrorToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>

          <Toast
            bg="warning"
            onClose={() => setShowWarningToast(false)}
            show={showWarningToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

      </div>
    </>
  );
}

export default Profile;
