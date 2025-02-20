import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Alert} from "react-bootstrap";

import API from "../../../config/apiConfig";
import "./details.css";

function Details() {
  const { id } = useParams();
  const [normativa, setNormativa] = useState(null);
  const [error, setError] = useState(null);

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
  

  
  

  return (
    <div className="page-form ">
      <div className="content-page-container">
      <h2 className="internal-title">Detalle de la Normativa</h2>

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
            {author_type}
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
        <div className="details-text-container">
            <p>Palabras claves: </p>
            {keywords && keywords.length > 0
                ? keywords.map((k) => k.word).join(" - ")
                : "Sin palabras claves"}
        </div>
        <div className="details-text-container">
            <p>Tema: </p>
            {subject || "Sin Asunto"}
        </div>
        {type !== "correspondence" &&(
            <>
            <div className="details-text-container">
            <p>PDF de la normativa en proceso: </p>
            {pdf_process ? (
                <a href={pdf_process} target="_blank" rel="noopener noreferrer">
                Ver PDF
                </a>
            ) : (
                "No disponible"
            )}
        </div>
        <div className="details-text-container">
            <p>PDF de la normativa aprobada: </p>
            {pdf_approved ? (
                <a href={pdf_approved} target="_blank" rel="noopener noreferrer">
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
            {regulations_that_modify && regulations_that_modify.length > 0
                ? regulations_that_modify.map((reg) => reg.number).join(", ")
                : "No aplica"}
        </div>
        </>
    )}
        
        </div>

     
    </div>
    </div>
  );
}

export default Details;
