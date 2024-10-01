import Form from "react-bootstrap/Form";
import "./searchFilter.css";

function SearchFilter() {
  return (
    
      <div className="filter-container">
        <Form className="filter">
          <h1>BÚSQUEDA DE NORMATIVAS</h1>

          <div className="inputs-filter">
            <div>
            <Form.Label>Por tipo de norma:</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>---selecciona una---</option>
              <option value="Ordenanza">Ordenanza</option>
              <option value="Minuta">Minuta</option>
              <option value="Declaracion">Declaración</option>
              <option value="Resolucion">Resolución</option>
              <option value="Decreto">Decreto</option>
            </Form.Select>
            </div>
            <div>
            <Form.Group>
              <Form.Label>Por texto:</Form.Label>
              <Form.Control type="text" placeholder="palabras claves" />
            </Form.Group>
            </div>
            <div>
            <Form.Group>
              <Form.Label>Por autor:</Form.Label>
              <Form.Control type="text" placeholder="nombre del autor" />
            </Form.Group>
            </div>
            <div>
            <Form.Group>
              <Form.Label>Por nro. de normativa:</Form.Label>
              <Form.Control type="text" placeholder="nro. de normativa" />
            </Form.Group>
            </div>
           
            
          </div>
          <div className="btn-container">
          <button className="btn-form" type="reset">Limpiar</button>
          <button className="btn-form" type="submit">Buscar</button>
        </div>
        </Form>
      </div>
  );
}

export default SearchFilter;
