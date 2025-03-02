import { Button } from "react-bootstrap";
import "./news.css";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";

function SeeNew({ news, newsList }) {
  const [selectedNews, setSelectedNews] = useState(news);

  //Filtrar la noticia seleccionada y tomar las 3 últimas en orden correcto
  const latestNews = newsList
    .filter((item) => item.id !== selectedNews?.id)
    .slice(-3) 
    .reverse();

  useEffect(() => {
    setSelectedNews(news);
  }, [news]);

  return (
    <div className="container-seeNew page-container d-flex">
      <div className="news-detail flex-grow-3 p-3">
        <h2 className="title-new-detail">{selectedNews?.title}</h2>
        <div className="container-photo">
          <img src={selectedNews?.image} alt="" width={"70%"} style={{ objectFit: "cover" }} />
        </div>
        <div className="container-allNew">
          <p
            className="text-new"
            dangerouslySetInnerHTML={{ __html: selectedNews?.description }}
          />
        </div>
        <div className="container-btn-back">
          <Button className="btn-back-new" href="/">Volver</Button>
        </div>
      </div>


      <div className="other-news flex-grow-1 p-3 d-none d-sm-flex">
        {latestNews.map((item) => (
          <Card key={item.id} className="other-news-card">
            <div className="news-link" onClick={() => setSelectedNews(item)}>
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


