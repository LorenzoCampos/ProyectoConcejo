import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Dropdown } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./normativas.css";

function CargarNormativas() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [authors, setAuthors] = useState("");
  const [authorsList, setAuthorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  const handleAuthorsChange = (e) => {
    setAuthors(e.target.value);
  };

  const addWord = () => {
    if (word.trim() !== "") {
      setWordList([...wordList, word.trim()]);
      setWord(""); // Limpiar el campo de entrada después de agregar la palabra
    }
  };

  const addAuthors = () => {
    if (authors.trim() !== "") {
      setAuthorsList([...authorsList, authors.trim()]);
      setAuthors(""); // Limpiar el campo de entrada después de agregar el autor
    }
  };

  const removeWord = (index) => {
    setWordList(wordList.filter((_, i) => i !== index));
  };

  const removeAuthors = (index) => {
    setAuthorsList(authorsList.filter((_, i) => i !== index));
  };

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "application/json",
        };

        let reqOptions = {
          url: API.LIST_REGULATIONS + `?page=1`,
          method: "GET",
          headers: headersList,
          body: JSON.stringify({ search: term }),
        };

        const response = await axios.request(reqOptions);
        setSearchResults(response.data);
        if (response.status === 200) {
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error en la búsqueda:", error.message);
        // Manejo de errores
        if (error.response) {
          console.error("Error en la solicitud:", error.response.data);
        } else {
          console.error("Error al enviar la solicitud:", error.message);
        }
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item.subject)) {
      setSelectedItems([...selectedItems, item.subject]); // Guarda solo el asunto
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API.CREATE_REGULATIONS, // URL del endpoint
        {
          keywords: wordList,
          authors: authorsList, // Datos del cuerpo de la solicitud
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
                <Form.Group controlId="type" className="mb-3">
                  <Form.Label>Tipo de normativa:</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>--- seleccionar tipo ---</option>
                    <option value="correspondence">Correspondencia</option>
                    <option value="declaration">Declaracion</option>
                    <option value="decree">Decreto</option>
                    <option value="minute">Minuta</option>
                    <option value="ordinance">Ordenanza</option>
                    <option value="resolution">Resolucion</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="typeAuthor" className="mb-3">
                  <Form.Label>Tipo de Autor:</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>--- seleccionar autor ---</option>
                    <option value="DEM">DEM</option>
                    <option value="concejal">Concejal</option>
                    <option value="particular">Particular</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="authors" className="mb-3">
                  <Form.Label>Autores:</Form.Label>
                  <div className="input-keywords">
                    <Form.Control
                      type="text"
                      placeholder="Agregar..."
                      value={authors}
                      onChange={handleAuthorsChange}
                    />
                    <Button variant="primary" onClick={addAuthors}>
                      +
                    </Button>
                  </div>

                  <div className="word-list">
                    {authorsList.map((a, index) => (
                      <div key={index} className="list">
                        {a}

                        <Button
                          className="btn-delete"
                          variant="danger"
                          size="sm"
                          onClick={() => removeAuthors(index)}
                        >
                          -
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>Estado:</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>--- seleccionar un estado ---</option>
                    <option value="process">En proceso</option>
                    <option value="approved">Aprobado</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="keywords" className="mb-3">
                  <Form.Label>Palabras claves:</Form.Label>
                  <div className="input-keywords">
                    <Form.Control
                      type="text"
                      placeholder="Agregar..."
                      value={word}
                      onChange={handleWordChange}
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

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Tema: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="breve descripcion..."
                  />
                </Form.Group>

                <Form.Group controlId="normToModif" className="mb-3">
                  <Form.Label>Norma a modificar:</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="mb-2"
                    />
                    {searchResults.length > 0 && (
                      <ul className="list-group position-absolute w-100">
                        {searchResults.map((result, index) => (
                          <li
                            key={result.id}
                            className="list-group-item"
                            onClick={() => handleSelectItem(result.subject)}
                          >
                            {result.subject}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="selected-items mt-2">
                    {selectedItems.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <span className="flex-grow-1">{item}</span>
                        <Button
                          className="btn-delete"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
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
