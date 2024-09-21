import Form from "react-bootstrap/Form";
import "./searchFilter.css"

function SearchFilter() {
  return (
    <>
      <div className="filter-container">
        <Form className="filter">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <h1>Búsqueda de normativas </h1>
            <Form.Label>Ejemplo</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default SearchFilter;
