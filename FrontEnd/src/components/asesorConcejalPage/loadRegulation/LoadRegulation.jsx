import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./loadRegulation.css";

function LoadRegulation() {
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

  const [state, setState] = useState("process");

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
    if (type === "dem-message") {
      setTypeAuthor("DEM");
    }

    if (type === "correspondence") {
      setTypeAuthor("particular");
    }

    // Automatically set typeAuthor to "concejal" for specific types
    if (["declaration", "minute", "resolution"].includes(type)) {
      setTypeAuthor("concejal");
    }

    // Reset fields based on type of normativa
    if (type === "correspondence") {
      setPdfProcess(null);
      setPdfApproved(null);
      setSelectedItems([]);
      setSelectedItemsModifiedBy([]);
    }
  }, [type]);

  useEffect(() => {
    if (userRole === "concejal") {
      setTypeAuthor("concejal");
    }
    // Automatically add DEM author if typeAuthor is DEM
    if (typeAuthor === "DEM") {
      setAuthorsList(["DEM"]);
    } else if (typeAuthor === "concejal") {
      const userName = localStorage.getItem("userName");
      const userLastName = localStorage.getItem("userLastName");
      const fullName = `${userName} ${userLastName}`.trim();
      setAuthorsList([fullName]);
    } else {
      setAuthorsList([]);
    }
  }, [typeAuthor]);

  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  const handleAuthorsChange = (e) => {
    setAuthors(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
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

  const adjustTextareaHeight = (e) => {
    // poner que sea una linea al principio
    e.target.style.height = "1px";
    e.target.style.height = `${e.target.scrollHeight}px`;
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
          url: API.LIST_REGULATIONS_MODIFIED + `?search=${term}&type=${type}`,
          method: "GET",
          headers: headersList,
        };

        const response = await axios.request(reqOptions);
        setSearchResults(response.data);
        if (response.status === 200) {
          console.log(response.data);
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
          url:
            API.LIST_REGULATIONS_MODIFIED +
            `?search=${term}&type=${type}&rule=modified-by`,
          method: "GET",
          headers: headersList,
        };

        const response = await axios.request(reqOptions);
        setSearchResultsModifiedBy(response.data);
        if (response.status === 200) {
          console.log(response.data);
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

    setMessage(""); // Resetear mensaje
    setMessageType("");

    // Verificar si el tipo no es "correspondence" y el estado es "approved" sin PDF aprobado
    if (type !== "correspondence" && state === "approved" && !pdfApproved) {
      setMessage("Debe subir el PDF de la normativa aprobada.");
      setMessageType("danger");
      window.scrollTo(0, 0);
      return;
    }

    // Verificar si el usuario es "concejal" y el tipo de autor no es "concejal"
    if (userRole === "concejal" && typeAuthor !== "concejal") {
      setMessage(
        "Como concejal, solo puede crear regulaciones con el tipo de autor 'concejal'."
      );
      setMessageType("danger");
      window.scrollTo(0, 0);
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("author_type", typeAuthor);
    authorsList.forEach((author, index) => {
      formData.append(`authors[${index}]`, author);
    });
    formData.append("state", state);
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
    formData.forEach((value, key) => {
      console.log(value, key);
    });
    try {
      const response = await axios.post(API.CREATE_REGULATIONS, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessage("Normativa creada correctamente.");
        setMessageType("success");
        window.scrollTo(0, 0);

        // Limpiar los campos del formulario
        setType("");
        setTypeAuthor("");
        setAuthors("");
        setAuthorsList([]);
        setState("");
        setWord("");
        setWordList([]);
        setSubject("");
        setPdfProcess(null);
        setPdfApproved(null);
        setSelectedItems([]);
        setSelectedItemsModifiedBy([]);
      }
    } catch (error) {
      if (error.response) {
        // Si el backend devuelve un error de validación
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          let errorMessages = Object.values(errors)
            .map((err) => err.join(" ")) // Unir mensajes de error por campo
            .join(" | "); // Separar con barra

          setMessage(`Errores de validación: ${errorMessages}`);
        } else {
          setMessage(`Error en la solicitud: ${error.response.data.message}`);
        }
      } else {
        setMessage(`Error al enviar la solicitud: ${error.message}`);
      }

      setMessageType("danger");
      window.scrollTo(0, 0);
    }
  };

  const getAuthorOptions = () => {
    if (type === "correspondence") {
      return (
        <>
          <option value="particular">Particular</option>
        </>
      );
    } else if (type === "ordinance" || type === "decree") {
      return (
        <>
          <option value="DEM">DEM</option>
          <option value="concejal">Concejal</option>
        </>
      );
    } else if (type === "dem-message") {
      return (
        <>

          <option value="DEM">DEM</option>
        </>
      );
    } else {
      return <option value="concejal">Concejal</option>;
    }
  };

  return (
    <div className="page-form">
      <div className="content-page-container">
        <h1 className="internal-title">Registrar Normativa</h1>
        {message && (
          <Alert variant={messageType} className="text-center">
            {message}
          </Alert>
        )}
        <div className="content-form">
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
                <option value="dem-message">Mensaje del DEM</option>
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
                  title="Agregar"
                >
                  +
                </Button>
              </div>

              <div className="word-list">
                {authorsList.map((a, index) => (
                  <div key={index} className="list">
                    {a}
                    {index !== 0 && (
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

            <Form.Group controlId="state" className="mb-3">
              <Form.Label>Estado:</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={state}
                onChange={handleStateChange}
                disabled={userRole === "concejal"}
              >
                <option value="process">En proceso</option> // Nota: Dejo de
                funcionar de la nada, no tocamos nada y funciona nuevamente xd.
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
                <Button title="Agregar" variant="primary" onClick={addWord}>
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
                className="input-subject"
                onInput={adjustTextareaHeight}
                as="textarea"
                placeholder="breve descripcion..."
                onChange={handleSubjectChange}
              />
            </Form.Group>

            {type !== "correspondence" && type !== "dem-message" && (
              <>
                <Form.Group controlId="pdfProcess" className="mb-3">
                  <Form.Label>PDF de la normativa en proceso:</Form.Label>
                  <Form.Control type="file" onChange={handlePdfProcessChange} />
                </Form.Group>

                <Form.Group controlId="pdfApproved" className="mb-3">
                  <Form.Label>PDF de la normativa aprobada:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handlePdfApprovedChange}
                  />
                </Form.Group>

                {(type === "ordinance" ||
                  type === "resolution" ||
                  type === "decree") && (
                  <>
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
                                onClick={() =>
                                  handleSelectItemModifiedBy(result)
                                }
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
              </>
            )}

            <div className="btn-container">
              <Button className="btn-banner" type="submit">
                Cargar Normativa
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoadRegulation;
