import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { /*useEffect,*/ useState } from "react";

import "./news.css";

//import axios from "axios";
//const endpoint = 'http://localhost:8080/api'
function News() {
  //const [news, setNews] = useState([]);
  const [visibleCards, setVisibleCards] = useState(6);

 /*
    useEffect(()=>{
      getAllNews()
    })

  const getAllNews = async ()=>{
    try {
      const response = await axios.get(${endpoint}/news)
      setNews(response.data)

    }catch (error) {
      console.error('Error al obtener las noticias:', error);
    }
};

*/
  const handleShowMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 6);
  };

  const handleShowLessCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards - 6);
  }

  // Datos simulados
  const news = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "Noticia 1",
      description: "Descripción de la noticia 1.",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "Noticia 2",
      description: "Descripción de la noticia 2.",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      title: "Noticia 3",
      description: "Descripción de la noticia 3.",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/150",
      title: "Noticia 4",
      description: "Descripción de la noticia 4.",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/150",
      title: "Noticia 5",
      description: "Descripción de la noticia 5.",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/150",
      title: "Noticia 6",
      description: "Descripción de la noticia 6.",
    },
    {
      id: 7,
      image: "https://via.placeholder.com/150",
      title: "Noticia 7",
      description: "Descripción de la noticia 7.",
    },
    {
      id: 8,
      image: "https://via.placeholder.com/150",
      title: "Noticia 8",
      description: "Descripción de la noticia 8.",
    },
    {
      id: 9,
      image: "https://via.placeholder.com/150",
      title: "Noticia 9",
      description: "Descripción de la noticia 9.",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/150",
      title: "Noticia 10",
      description: "Descripción de la noticia 10.",
    },
  ];

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
