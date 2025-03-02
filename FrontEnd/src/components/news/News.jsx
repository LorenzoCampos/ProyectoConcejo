import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState } from "react";

import "./news.css";
import SeeNew from "./SeeNew";

function News({ news, onSeeNew }) {
  const [visibleCards, setVisibleCards] = useState(6);
  const [newsSelected, setNewsSelected] = useState(null);

  const handleShowMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 6);
  };

  const handleShowLessCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards - 6);
  };

  const handleSeeNew = (item) => {
    onSeeNew(item);
    setNewsSelected(item);
  };

  return (
    <>
    
      <div className="cards-container">
        <div className="cards">
          {news.slice().reverse().slice(0, visibleCards).map((item) => (
            <Card key={item.id} className="shadow rounded fixed-card">
              <div className="img-container">
              <Card.Img variant="top" src={item.image} className="fixed-img"/>
              </div>
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
               
                <Card.Text className="limited-text" dangerouslySetInnerHTML={{ __html: item.description }} />
                <div className="button-container">
                  <Button className="btn-banner" onClick={() => handleSeeNew(item)}>Ver más</Button>
                </div>
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
      {newsSelected && <SeeNew news={newsSelected} newsList={Array.isArray(news) ? news : []} />}

    </>
  );
}

export default News;
