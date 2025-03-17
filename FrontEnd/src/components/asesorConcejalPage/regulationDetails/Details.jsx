import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./details.css";

function Details() {
  const { id } = useParams();
  const [normativa, setNormativa] = useState(null);
  const [error, setError] = useState(null);
  const [showModifications, setShowModifications] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(API.SHOW_REGULATION + id, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          },
        });
        console.log("Respuesta de la API:", response.data);

        if (response.status === 200) {
          setNormativa(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la normativa:", error);
        setError("Error al obtener la normativa.");
      }
    };

    fetchDetails();
  }, [id]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!normativa) {
    return <Alert variant="info">No se encontraron datos.</Alert>;
  }

  const {
    type,
    number,
    created_at,
    author_type,
    authors,
    state,
    keywords,
    subject,
    pdf_process,
    pdf_approved,
    regulations_modified,
    modifications,
    regulations_that_modify,
  } = normativa;

  const formatType = (type) => {
    switch (type) {
      case "correspondence":
        return "Correspondencia";

      case "ordinance":
        return "Ordenanza";

      case "resolution":
        return "Resolución";

      case "decree":
        return "Decreto";

      case "declaration":
        return "Declaración";

      case "minute":
        return "Minuta";

      default:
        return "Tipo no definido";
    }
  };

  const formatState = (state) => {
    switch (state) {
      case "process":
        return "En proceso";

      case "approved":
        return "Aprobada";

      default:
        return "Estado no definido";
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const translateModField = (field) => {
    switch (field) {
      case "relation: authors - added":
        return "Autor agregado";
      case "relation: authors - removed":
        return "Autor eliminado";
      case "relation: keywords - added":
        return "Palabra clave agregada";
      case "relation: keywords - removed":
        return "Palabra clave eliminada";
      case "author_type":
        return "Tipo de autor";
      case "authors":
        return "Autores";
      case "state":
        return "Estado";
      case "keywords":
        return "Palabras clave";
      case "subject":
        return "Tema";
      case "pdf_process":
        return "PDF de la normativa en proceso";
      case "pdf_approved":
        return "PDF de la normativa aprobada";
      case "regulations_modified":
        return "Norma/s a la que modifica";
      case "regulations_that_modify":
        return "Norma/s que la modifican";
      default:
        return field;
    }
  };

  const translateUndefined = (value, defaultValue) => {
    if (value === undefined || value === null || value === "undefined") {
      return defaultValue;
    }
    // Eliminar comillas si están presentes
    return typeof value === "string" ? value.replace(/^"|"$/g, "") : value;
  };

  const renderCell = (cell, field) => {
    const translatedCell = translateUndefined(cell, "Eliminado");
    const isLink =
      typeof translatedCell === "string" && translatedCell.startsWith("https");

      if (field === "state") {
        return formatState(translatedCell);
      }

    return isLink ? (
      <a href={translatedCell} target="_blank" rel="noopener noreferrer">
        Ver PDF
      </a>
    ) : (
      translatedCell
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Ordenar por fecha ascendente (de más antiguo a más reciente)
  modifications.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));

  const handleShowModifications = () => {
    setShowModifications(!showModifications);
  };

  return (
    <div className="page-form flex-column">
      <div className="content-page-container">
        <h2 className="internal-title">
          {formatType(type)} N°{normativa.number}
        </h2>
        {modifications[0] && (
          <Button variant="secondary" onClick={handleShowModifications}>
            {showModifications
              ? "Ocultar modificaciones"
              : "Mostrar modificaciones"}
          </Button>
        )}
        <div className="cont-details-modifications">
          <div className="content-page-container">
            <h2 className="internal-title">Detalles</h2>
            <div className="container-details">
              <div className="details-text-container">
                <p>Tipo de Normativa: </p>
                {formatType(type)}
              </div>
              <div className="details-text-container">
                <p>Normativa N°: </p>
                {number}
              </div>
              <div className="details-text-container">
                <p>Fecha de creación: </p>
                {formatDateTime(created_at)}
              </div>
              <div className="details-text-container">
                <p>Tipo de autor: </p>
                {capitalizeFirstLetter(author_type)}
              </div>
              <div className="details-text-container">
                <p>Autores: </p>
                {authors && authors.length > 0
                  ? authors.map((a) => a.name).join(", ")
                  : "Sin autores"}
              </div>
              <div className="details-text-container">
                <p>Estado: </p>
                {formatState(state)}
              </div>
              <div className="details-text-container keywords">
                <p>Palabras claves: </p>
                {keywords && keywords.length > 0
                  ? keywords.map((k) => k.word).join(" - ")
                  : "Sin palabras claves"}
              </div>
              <div className="details-text-container">
                <p>Tema: </p>
                {subject || "Sin Asunto"}
              </div>
              {type !== "correspondence" && (
                <>
                  <div className="details-text-container">
                    <p>PDF de la normativa en proceso: </p>
                    {pdf_process ? (
                      <a
                        href={pdf_process}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver PDF
                      </a>
                    ) : (
                      "No disponible"
                    )}
                  </div>
                  <div className="details-text-container">
                    <p>PDF de la normativa aprobada: </p>
                    {pdf_approved ? (
                      <a
                        href={pdf_approved}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver PDF
                      </a>
                    ) : (
                      "No disponible"
                    )}
                  </div>
                  <div className="details-text-container">
                    <p>Norma/s a la que modifica: </p>
                    {regulations_modified && regulations_modified.length > 0
                      ? regulations_modified.map((reg) => reg.number).join(", ")
                      : "No aplica"}
                  </div>
                  <div className="details-text-container">
                    <p>Norma/s que la modifican: </p>
                    {regulations_that_modify &&
                    regulations_that_modify.length > 0
                      ? regulations_that_modify
                          .map((reg) => reg.number)
                          .join(", ")
                      : "No aplica"}
                  </div>
                </>
              )}
            </div>
          </div>

          {showModifications && (
            <div className="content-page-container">
              <h2 className="internal-title">Modificaciones</h2>
              {modifications
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map((mod, index) => (
                  <div key={index} className="container-details">
                    <div className="details-text-container">
                      <p>Autor: </p>
                      {mod.name}
                    </div>
                    <div className="details-text-container">
                      <p>Fecha de modificación: </p>
                      {new Date(mod.updated_at).toLocaleString()}
                    </div>
                    <div className="details-text-container">
                      <p>Campo que se modificó: </p>
                      {translateModField(mod.name_cell)}
                    </div>
                    {mod.name_cell.startsWith("relation") ? (
                      <>
                        {mod.name_cell.endsWith("added") ? (
                          <div className="details-text-container">
                            <p>Agregado: </p>
                            {renderCell(mod.new_cell, mod.name_cell)}
                          </div>
                        ) : (
                          <div className="details-text-container">
                            <p>Eliminado: </p>
                            {renderCell(mod.old_cell, mod.name_cell)}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="details-text-container">
                          <p>Antes: </p>
                          {renderCell(mod.old_cell, mod.name_cell)}
                        </div>
                        <div className="details-text-container">
                          <p>Después: </p>
                          {renderCell(mod.new_cell, mod.name_cell)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;
