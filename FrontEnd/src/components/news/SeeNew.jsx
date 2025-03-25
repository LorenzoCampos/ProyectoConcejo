import { Button } from "react-bootstrap";
import "./news.css";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
import { useParams, useLocation } from "react-router-dom";
import "./news.css";

function SeeNew() {
  const { id } = useParams(); // Obtener ID de la URL
  const location = useLocation();
  const { newsList } = location.state || {}; // Obtener la lista de noticias del estado

  // Buscar la noticia en la lista si no está en el estado
  const findNews = (newsId) => newsList?.find((item) => item.id.toString() === newsId);

  const [currentNews, setCurrentNews] = useState(() => findNews(id));

  useEffect(() => {
    setCurrentNews(findNews(id));
  }, [id, newsList]);

  if (!currentNews) {
    return <p>No se encontró la noticia.</p>; // Manejo de error si no hay noticia seleccionada
  }

  const latestNews = newsList?.filter((item) => item.id !== currentNews.id).slice(-3).reverse();

  return (
    <div className="container-seeNew d-flex">
      <div className="news-detail flex-grow-3 p-3">
        <h2 className="title-new-detail">{currentNews.title}</h2>
        <div className="container-photo">
          <img src={currentNews.image} alt="" width={"70%"} style={{ objectFit: "cover" }} />
        </div>
        <div className="container-date">
          <FaRegClock size={20} />
          <span>
            Fecha de publicación:{" "}
            {new Date(currentNews.updated_at)
              .toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
              .replace(/^./, (str) => str.toUpperCase())}
          </span>
        </div>
        <div className="container-allNew">
          <p className="text-new" dangerouslySetInnerHTML={{ __html: currentNews.description }} />
        </div>
        <div className="container-btn-back">
          <Button className="btn-back-new" href="/">Volver</Button>
        </div>
      </div>

      <div className="other-news flex-grow-1 p-3 d-none d-sm-flex">
        {latestNews?.map((item) => (
          <Card key={item.id} className="other-news-card">
            <div className="news-link" onClick={() => setCurrentNews(item)}>
              <Card.Img variant="top" src={item.image} className="other-news-img" />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SeeNew;
