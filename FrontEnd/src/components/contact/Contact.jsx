import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./contact.css";

function Contact() {
  return (
    <>
<<<<<<< HEAD
      <Form className="form">
        <h3>Contacto</h3>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control size="md" type="email" placeholder="mail@ejemplo.com" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            size="md"
            type="text"
            placeholder="Nombre y Apellido."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            size="md"
            as="textarea"
            rows={3}
            placeholder="Escriba su mensaje..."
          />
        </Form.Group>

        <Button>Enviar</Button>
      </Form>

      <Form className="form">
        <h3>Contacto</h3>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control size="md" type="email" placeholder="mail@ejemplo.com" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            size="md"
            type="text"
            placeholder="Nombre y Apellido."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            size="md"
            as="textarea"
            rows={3}
            placeholder="Escriba su mensaje..."
          />
        </Form.Group>
=======
      <div className='container-forms'>

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
>>>>>>> 1eb4bce311f1166558d3d3d5bbe5da1ca066c048

            <Button>Enviar</Button>
          </Form>

      </div>
    </>
  );
}

export default Contact;
