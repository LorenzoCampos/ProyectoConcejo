import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState, useEffect } from "react";
import axios from "axios";

import API from "../../../config/apiConfig";

import "./regulations.css";


function ListRegulations() {

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getRegulations = async () => {
    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.LIST_REGULATIONS,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      setData(response.data);
      /* console.log(response.data); */
    } catch (error) {
      if (error.response) {
        setToastMessage("Error al obtener las normativas.");
        setShowErrorToast(true);
      }
    }
  };

  return (
    <div className="regulations-container">
      <h1 className="title-text">Lista de Normativas</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>
                <Form.Select
                  aria-label="Filtrar por tipo"
                  /* value={}
                  onChange={} */
                >
                  <option value="">Tipo</option>
                  <option value="Inactivo">Ordenanza</option>
                  <option value="Inactivo">Resolución</option>
                  <option value="Inactivo">Minuta</option>
                  <option value="Inactivo">Decreto</option>
                  <option value="Inactivo">Declaración</option>
                  <option value="Inactivo">Correspondencia</option>
                </Form.Select>
              </th>
              <th>
                <div className="th-input">
                  <Form.Control type="number" placeholder="N°..."/>
                </div>
              </th>
              <th>
                <div className="th-input">
                  <Form.Label>Desde:</Form.Label>
                  <Form.Control type="date" placeholder="Desde..."/>  
                </div>
              </th>
              <th>
                <div className="th-input">
                  <Form.Label>Hasta:</Form.Label>
                  <Form.Control type="date" placeholder="Hasta..."/>
                </div>
              </th>
              <th>
                <Form.Select
                  aria-label="Filtrar por estado"
                 /*  value={}
                  onChange={} */
                >
                  <option value="">Estado</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Form.Select>
              </th>
              <th>
                <Form.Select
                  aria-label="Filtrar por autor"
                 /*  value={}
                  onChange={} */
                >
                  <option value="Autor">Autor</option>
                  <option value="Concejal">Concejal</option>
                  <option value="DEM">DEM</option>
                  <option value="Particular">Particular</option>
                </Form.Select>
              </th>
              <th>
                <Button variant="primary">Filtrar</Button>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Toasts */}
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
          bg="warning"
          onClose={() => setShowWarningToast(false)}
          show={showWarningToast}
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
      </ToastContainer>
    </div>
  )
}

export default ListRegulations;