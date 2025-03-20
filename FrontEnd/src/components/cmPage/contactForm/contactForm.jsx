import {useState, useEffect} from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";

import API from "../../../config/apiConfig";
function ContactForm() {

  const handleSubmit = async (e) => {
    e.prevent.default();


  };

  return (
    <> 
      <div className="page-form">
        <div className="content-page-container">
          <h2 className="internal-tittle">Imagenes del apartado contactos</h2>
          <div className="content-form">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen izquierda</Form.Label>
                <Form.Control type="file"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Imagen derecha</Form.Label>
                <Form.Control type="file"/>
              </Form.Group>
              <Button>
                Cargar imagenes
              </Button>
            </Form>
          </div>
        </div>
      </div>
        
    </>

  )
}

export default ContactForm;