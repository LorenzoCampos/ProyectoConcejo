import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState } from "react";

import "./news.css";

function News({news}) {
  
  const [visibleCards, setVisibleCards] = useState(6);

 


  const handleShowMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 6);
  };

  const handleShowLessCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards - 6);
  }

  // Datos simulados
  

  return (
    <>
    <div className="cards-container">
      <div className="cards">
        {news.slice(0, visibleCards).map((item) => (
          <Card key={item.id}>
            <Card.Img variant="top" src={item.image} />

            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <Button variant="primary">Ver más</Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {visibleCards < news.length && (
        <div className="btn-container">
          <Button onClick={handleShowMoreCards} className="btn-see-more">
            Ver más
          </Button>
        </div>
      )}

      {visibleCards > 6 && (
        <Button onClick={handleShowLessCards} className="btn-see-more">
          Ver menos
        </Button>
      )}

      </div>
    </>
  );
}

export default News;
