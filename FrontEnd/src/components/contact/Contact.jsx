import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

import "./contact.css";

function Contact() {
  return (
    <>
      <Form className='form'>
        <h3>Contacto</h3>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control size='md' type="email" placeholder="mail@ejemplo.com" />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Nombre</Form.Label>
          <Form.Control size='md' type="text" placeholder="Nombre y Apellido." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control size='md' as="textarea" rows={3} placeholder='Escriba su mensaje...'/>
        </Form.Group>

        <Button>Enviar</Button>
      </Form>
    </>
  );
}

export default Contact;