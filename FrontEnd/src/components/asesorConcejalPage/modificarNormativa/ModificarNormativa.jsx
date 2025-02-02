import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./modificarNormativa.css";

function ModificarNormativa() {
  const [userRole, setUserRole] = useState("");

  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);

  const [authors, setAuthors] = useState("");
  const [authorsList, setAuthorsList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [searchTermModifiedBy, setSearchTermModifiedBy] = useState("");
  const [searchResultsModifiedBy, setSearchResultsModifiedBy] = useState([]);
  const [selectedItemsModifiedBy, setSelectedItemsModifiedBy] = useState([]);

  const [status, setStatus] = useState("");

  const [pdfProcess, setPdfProcess] = useState(null);
  const [pdfApproved, setPdfApproved] = useState(null);

  const [type, setType] = useState("");
  const [typeAuthor, setTypeAuthor] = useState("");
  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "danger"

  const searchResultsRef = useRef(null);
  const searchResultsModifiedByRef = useRef(null);

  useEffect(() => {
    // Obtener el rol del usuario desde el localStorage y establecerlo en el estado
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Agregar manejador de eventos para detectar clics fuera del componente
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpiar el manejador de eventos al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target)
    ) {
      setSearchResults([]);
    }
    if (
      searchResultsModifiedByRef.current &&
      !searchResultsModifiedByRef.current.contains(event.target)
    ) {
      setSearchResultsModifiedBy([]);
    }
  };

  useEffect(() => {
    // Reset fields based on type of normativa
    if (type === "correspondence") {
      setPdfProcess(null);
      setPdfApproved(null);
      setSelectedItems([]);
      setSelectedItemsModifiedBy([]);
    }
  }, [type]);

  useEffect(() => {
    // Automatically add DEM author if typeAuthor is DEM
    if (typeAuthor === "DEM") {
      setAuthorsList(["DEM"]);
    } else {
      setAuthorsList([]);
    }
  }, [typeAuthor]);

  useEffect(() => {
    // Automatically set typeAuthor to "concejal" for specific types
    if (["declaration", "minute", "resolution", "decree"].includes(type)) {
      setTypeAuthor("concejal");
    }
  }, [type]);

  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  const handleAuthorsChange = (e) => {
    setAuthors(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePdfProcessChange = (e) => {
    setPdfProcess(e.target.files[0]);
  };

  const handlePdfApprovedChange = (e) => {
    setPdfApproved(e.target.files[0]);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setTypeAuthor(""); // Reset typeAuthor when type changes
  };

  const handleTypeAuthorChange = (e) => {
    setTypeAuthor(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
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
          url: API.LIST_REGULATIONS + `?page=1&search=${term}`,
          method: "GET",
          headers: headersList,
        };

        const response = await axios.request(reqOptions);
        setSearchResults(response.data.data);
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

  const handleSearchChangeModifiedBy = async (e) => {
    const term = e.target.value;
    setSearchTermModifiedBy(term);

    if (term.length > 2) {
      try {
        let headersList = {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
          "Content-Type": "application/json",
        };

        let reqOptions = {
          url: API.LIST_REGULATIONS + `?page=1&search=${term}`,
          method: "GET",
          headers: headersList,
        };

        const response = await axios.request(reqOptions);
        setSearchResultsModifiedBy(response.data.data);
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
      setSearchResultsModifiedBy([]);
    }
  };

  const handleSelectItem = (item) => {
    // Verificar que el item no este ya en la lista mediante id
    if (!selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]); // Guarda solo el asunto
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSelectItemModifiedBy = (item) => {
    // Verificar que el item no este ya en la lista mediante id
    if (!selectedItemsModifiedBy.some((i) => i.id === item.id)) {
      setSelectedItemsModifiedBy([...selectedItemsModifiedBy, item]); // Guarda solo el asunto
    }
    setSearchTermModifiedBy("");
    setSearchResultsModifiedBy([]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleRemoveItemModifiedBy = (index) => {
    setSelectedItemsModifiedBy(
      selectedItemsModifiedBy.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el tipo no es "correspondence" y el estado es "approved" sin PDF aprobado
    if (type !== "correspondence" && status === "approved" && !pdfApproved) {
      setMessage("Debe subir el PDF de la normativa aprobada.");
      setMessageType("danger");
      window.scrollTo(0, 0); // Desplazar hacia arriba
      return;
    }

    // Verificar si el usuario es "concejal" y el tipo de autor no es "concejal"
    if (userRole === "concejal" && typeAuthor !== "concejal") {
      setMessage(
        "Como concejal, solo puede crear regulaciones con el tipo de autor 'concejal'."
      );
      setMessageType("danger");
      window.scrollTo(0, 0); // Desplazar hacia arriba
      return;
    }

    const formData = new FormData();

    formData.append("author_type", typeAuthor);
    authorsList.forEach((author, index) => {
      formData.append(`authors[${index}]`, author);
    });
    formData.append("state", status);
    wordList.forEach((keyword, index) => {
      formData.append(`keywords[${index}]`, keyword);
    });
    formData.append("subject", subject);
    if (pdfProcess) {
      formData.append("pdf_process", pdfProcess);
    }
    if (pdfApproved) {
      formData.append("pdf_approved", pdfApproved);
    }
    selectedItems.forEach((item, index) => {
      formData.append(`modifies[${index}]`, item.id);
    });
    selectedItemsModifiedBy.forEach((item, index) => {
      formData.append(`modified_by[${index}]`, item.id);
    });

    try {
      const response = await axios.post(
        API.UPDATE_REGULATIONS + id, // URL del endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token de autenticación
            "Content-Type": "multipart/form-data", // Tipo de contenido
          },
        }
      );

      // Manejo de la respuesta
      if (response.status === 201) {
        setMessage("Normativa modificada correctamente.");
        setMessageType("success");
        window.scrollTo(0, 0); // Desplazar hacia arriba

        // Limpiar los campos del formulario
        setType("");
        setTypeAuthor("");
        setAuthors("");
        setAuthorsList([]);
        setStatus("");
        setWord("");
        setWordList([]);
        setSubject("");
        setPdfProcess(null);
        setPdfApproved(null);
        setSelectedItems([]);
        setSelectedItemsModifiedBy([]);
      }
    } catch (error) {
      // Manejo de errores
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(" ");
        setMessage(`Error en la solicitud: ${errorMessages}`);
      } else if (error.response) {
        setMessage(
          `Error al enviar la solicitud: ${error.response.data.message}`
        );
      } else {
        setMessage(`Error al enviar la solicitud: ${error.message}`);
      }
      setMessageType("danger");
      window.scrollTo(0, 0); // Desplazar hacia arriba
    }
  };

  const getAuthorOptions = () => {
    if (type === "correspondence") {
      return (
        <>
          <option value="DEM">DEM</option>
          <option value="particular">Particular</option>
        </>
      );
    } else if (type === "ordinance") {
      return (
        <>
          <option value="DEM">DEM</option>
          <option value="concejal">Concejal</option>
        </>
      );
    } else {
      return <option value="concejal">Concejal</option>;
    }
  };

  return (
    <div className="container cont-norm">
      <h1 className="text-center title-text">Modificar Normativa</h1>
      {message && (
        <Alert variant={messageType} className="text-center">
          {message}
        </Alert>
      )}
      <div className="form-banner">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="type" className="mb-3">
            <Form.Label>Tipo de normativa:</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={type}
              onChange={handleTypeChange}
            >
              <option>--- seleccionar tipo ---</option>
              {userRole !== "concejal" && (
                <option value="correspondence">Correspondencia</option>
              )}
              <option value="declaration">Declaracion</option>
              <option value="decree">Decreto</option>
              <option value="minute">Minuta</option>
              <option value="ordinance">Ordenanza</option>
              <option value="resolution">Resolucion</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="typeAuthor" className="mb-3">
            <Form.Label>Tipo de Autor:</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={typeAuthor}
              onChange={handleTypeAuthorChange}
            >
              <option>--- seleccionar autor ---</option>
              {getAuthorOptions()}
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
                disabled={typeAuthor === "DEM"}
              />
              <Button
                variant="primary"
                onClick={addAuthors}
                disabled={typeAuthor === "DEM"}
              >
                +
              </Button>
            </div>

            <div className="word-list">
              {authorsList.map((a, index) => (
                <div key={index} className="list">
                  {a}
                  {typeAuthor !== "DEM" && (
                    <Button
                      className="btn-delete"
                      variant="danger"
                      size="sm"
                      onClick={() => removeAuthors(index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="status" className="mb-3">
            <Form.Label>Estado:</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={status}
              onChange={handleStatusChange}
              disabled={userRole === "concejal"}
            >
              <option value="process">En proceso</option>
              {userRole !== "concejal" && (
                <option value="approved">Aprobado</option>
              )}
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
              onChange={handleSubjectChange}
            />
          </Form.Group>

          {type !== "correspondence" && (
            <>
              <Form.Group controlId="pdfProcess" className="mb-3">
                <Form.Label>PDF de la normativa en proceso:</Form.Label>
                <Form.Control type="file" onChange={handlePdfProcessChange} />
              </Form.Group>

              <Form.Group controlId="pdfApproved" className="mb-3">
                <Form.Label>PDF de la normativa aprobada:</Form.Label>
                <Form.Control type="file" onChange={handlePdfApprovedChange} />
              </Form.Group>

              <Form.Group controlId="normToModif" className="mb-3">
                <Form.Label>Norma/s a la que modifica:</Form.Label>
                <div className="position-relative" ref={searchResultsRef}>
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
                          onClick={() => handleSelectItem(result)}
                        >
                          {result.subject}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="word-list">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="list">
                      <span className="flex-grow-1">
                        {item.type} N° {item.number}
                      </span>
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

              <Form.Group controlId="normModifiedBy" className="mb-3">
                <Form.Label>Norma/s que la modifican:</Form.Label>
                <div
                  className="position-relative"
                  ref={searchResultsModifiedByRef}
                >
                  <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={searchTermModifiedBy}
                    onChange={handleSearchChangeModifiedBy}
                    className="mb-2"
                  />
                  {searchResultsModifiedBy.length > 0 && (
                    <ul className="list-group position-absolute w-100">
                      {searchResultsModifiedBy.map((result, index) => (
                        <li
                          key={result.id}
                          className="list-group-item"
                          onClick={() => handleSelectItemModifiedBy(result)}
                        >
                          {result.subject}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="word-list">
                  {selectedItemsModifiedBy.map((item, index) => (
                    <div key={index} className="list">
                      <span className="flex-grow-1">
                        {item.type} N° {item.number}
                      </span>
                      <Button
                        className="btn-delete"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItemModifiedBy(index)}
                      >
                        -
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </>
          )}

          <div className="btn-container">
            <Button className="btn-banner" type="submit">
              Modificar Normativa
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ModificarNormativa;
