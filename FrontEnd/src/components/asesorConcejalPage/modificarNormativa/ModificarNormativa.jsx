import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./modificarNormativa.css";

import { FaRegFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function ModificarNormativa() {
  const { id } = useParams();

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

  const [originalPdfProcess, setOriginalPdfProcess] = useState(null);
  const [originalPdfApproved, setOriginalPdfApproved] = useState(null);

  const [type, setType] = useState("");
  const [typeAuthor, setTypeAuthor] = useState("");
  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "danger"

  const [forceUpdate, setForceUpdate] = useState(0);

  const searchResultsRef = useRef(null);
  const searchResultsModifiedByRef = useRef(null);

  // Definir variables originales
  const [originalType, setOriginalType] = useState("");
  const [originalTypeAuthor, setOriginalTypeAuthor] = useState("");
  const [originalStatus, setOriginalStatus] = useState("");
  const [originalSubject, setOriginalSubject] = useState("");
  const [originalAuthorsList, setOriginalAuthorsList] = useState([]);
  const [originalWordList, setOriginalWordList] = useState([]);
  const [originalSelectedItems, setOriginalSelectedItems] = useState([]);
  const [originalSelectedItemsModifiedBy, setOriginalSelectedItemsModifiedBy] = useState([]);

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

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePdfProcessChange = (e) => {
    const file = e.target.files[0] || null;
    setPdfProcess(file);
  };

  const handlePdfApprovedChange = (e) => {
    const file = e.target.files[0] || null;
    setPdfApproved(file);
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

    if (term && term.length > 2) {
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
        setSearchResults(response.data || []);
/*         if (response.status === 200) {
          console.log(response.data);
        } */
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

    if (term && term.length > 2) {
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
        setSearchResultsModifiedBy(response.data || []);
/*         if (response.status === 200) {
          console.log(response.data);
        } */
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

  useEffect(() => {
    const fetchNormativa = async () => {
      try {
        const response = await axios.get(API.SHOW_REGULATION + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const normativa = response.data;
          /* console.log(normativa); */
          setType(normativa.type);
          setTypeAuthor(normativa.author_type);
          setAuthorsList(normativa.authors.map((a) => a.name)); // Convertir a array de nombres
          setStatus(normativa.state);
          setWordList(normativa.keywords.map((k) => k.word)); // Convertir a array de palabras
          setSubject(normativa.subject);
          setPdfProcess(normativa.pdf_process);
          setPdfApproved(normativa.pdf_approved);
          setSelectedItems(normativa.regulations_modified || []);
          setSelectedItemsModifiedBy(normativa.regulations_that_modify || []);

          // Guardar los valores originales
          setOriginalType(normativa.type);
          setOriginalTypeAuthor(normativa.author_type);
          setOriginalStatus(normativa.state);
          setOriginalSubject(normativa.subject);
          setOriginalAuthorsList(normativa.authors.map((a) => a.name));
          setOriginalWordList(normativa.keywords.map((k) => k.word));
          setOriginalSelectedItems(normativa.regulations_modified || []);
          setOriginalSelectedItemsModifiedBy(normativa.regulations_that_modify || []);
          setOriginalPdfProcess(normativa.pdf_process);
          setOriginalPdfApproved(normativa.pdf_approved);
        }
      } catch (error) {
        console.error("Error al obtener la normativa:", error);
      } finally {
        // Forzar actualización del componente (NO TOCAR)
        // Esto arregla el problema de la carga de la lista de autores
        setForceUpdate(1);
      }
    };

    fetchNormativa();
  }, [id, forceUpdate]);

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

    // Comparar y agregar solo los campos modificados
    if (type !== originalType) formData.append("type", type);
    if (typeAuthor !== originalTypeAuthor) formData.append("author_type", typeAuthor);
    if (status !== originalStatus) formData.append("state", status);
    if (subject !== originalSubject) formData.append("subject", subject);

    if (pdfProcess !== originalPdfProcess) {
      if (pdfProcess === null) {
        formData.append("pdf_process", null); // No hace nada
      } else if (pdfProcess === undefined) {
        formData.append("pdf_process", undefined); // Borra el pdf
      } else {
        formData.append("pdf_process", pdfProcess); // Carga el pdf
      }
    }

    if (pdfApproved !== originalPdfApproved) {
      if (pdfApproved === null) {
        formData.append("pdf_approved", null); // No hace nada
      } else if (pdfApproved === undefined) {
        formData.append("pdf_approved", undefined); // Borra el pdf
      } else {
        formData.append("pdf_approved", pdfApproved); // Carga el pdf
      }
    }

    // Enviar todo el array si hubo alguna modificación o si está vacío
    if (JSON.stringify(authorsList) !== JSON.stringify(originalAuthorsList) || authorsList.length === 0) {
      authorsList.forEach((author, index) => {
        formData.append(`authors[${index}]`, author);
      });
    } else if (authorsList.length === 0) {
      formData.append("authors", []);
    }

    if (wordList.length === 0) {
      formData.append("keywords", []); // "[null]"
    } else if (JSON.stringify(wordList) !== JSON.stringify(originalWordList)) {
      formData.append("keywords", JSON.stringify(wordList)); // Enviar el array completo como JSON
    }

    if (JSON.stringify(selectedItems) !== JSON.stringify(originalSelectedItems) || selectedItems.length === 0) {
      selectedItems.forEach((item, index) => {
        formData.append(`modifies[${index}]`, item.id);
      });
    } else if (selectedItems.length === 0) {
      formData.append("modifies", []);
    }

    // {
    //   "keywords": []
    // }

    if (JSON.stringify(selectedItemsModifiedBy) !== JSON.stringify(originalSelectedItemsModifiedBy) || selectedItemsModifiedBy.length === 0) {
      selectedItemsModifiedBy.forEach((item, index) => {
        formData.append(`modified_by[${index}]`, item.id);
      });
    } else if (selectedItemsModifiedBy.length === 0) {
      formData.append("modified_by", []);
    }

    try {
      const response = await axios.post(
        API.UPDATE_REGULATIONS + id, // URL del endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token de autenticación
            "Content-Type": "application/json", // Tipo de contenido
          },
        }
      );

      // Manejo de la respuesta
      if (response.status === 200) {
        setMessage("Normativa modificada correctamente.");
        console.log(response.data);
        setMessageType("success");
        window.scrollTo(0, 0); // Desplazar hacia arriba
/*         setTimeout(() => {
          window.location.reload(); // Recargar la página
        }, 1500); */
      }
    } catch (error) {
      // Manejo de errores
      if (error.response.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.keys(errors).map((key) => {
          if (Array.isArray(errors[key])) {
            return errors[key].join(", ");
          } else {
            return errors[key];
          }
        });
        setMessage(errorMessages.join(" "));
      } else {
        setMessage(`Error en la solicitud: ${error.response.data.message}`);
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
      <>
        <option value="DEM">DEM</option>
      </>;
    } else {
      return <option value="concejal">Concejal</option>;
    }
  };

  return (
    <div className="page-form">
      <div className="content-page-container">
        <h1 className="internal-title">Modificar Normativa</h1>
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
                disabled
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
                /* placeholder="breve descripcion..." */
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>

            {type !== "correspondence" && type !== "dem-message" && (
              <>
                <Form.Group controlId="pdfProcess" className="mb-3">
                  <Form.Label>PDF de la normativa en proceso:</Form.Label>
                  <Form.Control type="file" onChange={handlePdfProcessChange} />

                  {pdfProcess && pdfProcess !== "undefined" && pdfProcess !== "null" && (
                    <>
                      <div className="container-pdf-modify">
                        <b className="container-pdf-modify__b">
                          PDF cargado actualmente:
                        </b>
                        <Button
                          title="Ver PDF"
                          className="container-pdf-modify__pdf"
                          variant="danger"
                          href={pdfProcess}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaRegFilePdf style={{ color: "white" }} />
                        </Button>
                        <Button
                          title="Eliminar PDF"
                          className="container-pdf-modify__delete"
                          variant="danger"
                          onClick={() => setPdfProcess(undefined)}
                        >
                          <MdDelete size={20} />
                        </Button>
                      </div>
                    </>
                  )}
                </Form.Group>

                <Form.Group controlId="pdfApproved" className="mb-3">
                  <Form.Label>PDF de la normativa aprobada:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handlePdfApprovedChange}
                  />

                  {pdfApproved && pdfApproved !== "undefined" && pdfApproved !== "null" && (
                    <div className="container-pdf-modify">
                      <b className="container-pdf-modify__b">
                        PDF cargado actualmente:
                      </b>
                      <Button
                        className="container-pdf-modify__pdf"
                        variant="danger"
                        href={pdfApproved}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaRegFilePdf style={{ color: "white" }} />
                      </Button>
                      <Button
                        title="Eliminar PDF"
                        className="container-pdf-modify__delete"
                        variant="danger"
                        onClick={() => setPdfApproved(undefined)}
                      >
                        <MdDelete size={20} />
                      </Button>
                    </div>
                  )}
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
                        {Array.isArray(searchResults) &&
                          searchResults.length > 0 && (
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
                            {/*<span>{normativas.modifies}</span>*/}
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
                        {Array.isArray(searchResultsModifiedBy) &&
                          searchResultsModifiedBy.length > 0 && (
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
                            {/* <span>{normativas.modified_by}</span>*/}
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

            <div className="btn-container-form">
              <Button className="btn-banner" type="submit">
                Modificar Normativa
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ModificarNormativa;
