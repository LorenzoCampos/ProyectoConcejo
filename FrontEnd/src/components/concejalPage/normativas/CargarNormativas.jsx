import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./normativas.css";

function CargarNormativas() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);

  const handleInputChange = (e) => {
    setWord(e.target.value);
  };

  const addWord = () => {
    if (word.trim() !== "") {
      setWordList([...wordList, word.trim()]);
      setWord(""); // Limpiar el campo de entrada después de agregar la palabra
    }
  };

  const removeWord = (index) => {
    setWordList(wordList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API.CREATE_REGULATIONS, // URL del endpoint
        {
          keywords: wordList, // Datos del cuerpo de la solicitud
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token de autenticación
            "Content-Type": "application/json", // Tipo de contenido
          },
        }
      );

      // Manejo de la respuesta
      if (response.status === 201) {
        console.log("Normativa creada correctamente.");
        console.log(response.data);
      }
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        console.error("Error en la solicitud:", error.response.data);
      } else {
        console.error("Error al enviar la solicitud:", error.message);
      }
    }
  };

  return (
    <div className="container">
      <Container>
        <Row>
          <Col>
            <h1 className="text-center title-text">Registrar Normativa</h1>
            <div className="form-banner">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile">
                  <Form.Label>Seleccionar Tipo</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>--- selecciona una ---</option>
                    <option value="correspondence">Correspondencia</option>
                    <option value="declaration">Declaracion</option>
                    <option value="decree">Decreto</option>
                    <option value="minute">Minuta</option>
                    <option value="ordinance">Ordenanza</option>
                    <option value="resolution">Resolucion</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>--- selecciona una ---</option>
                    <option value="process">En proceso</option>
                    <option value="approved">Aprobada</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="publicationDate" className="mb-3">
                  <Form.Label>Palabras claves:</Form.Label>
                  <div className="input-keywords">
                    <Form.Control
                      type="text"
                      placeholder="agregar..."
                      value={word}
                      onChange={handleInputChange}
                    />
                    <Button variant="primary" onClick={addWord}>
                      +
                    </Button>
                  </div>

                  <div className="word-list">
                    {wordList.map((w, index) => (
                      <div key={index} className="list">
                        {w}

                        <Button
                          className="btn-delete"
                          variant="danger"
                          size="sm"
                          onClick={() => removeWord(index)}
                        >
                          -
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <div className="btn-container">
                  <Button className="btn-banner" type="submit">
                    Cargar Normativa
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CargarNormativas;
