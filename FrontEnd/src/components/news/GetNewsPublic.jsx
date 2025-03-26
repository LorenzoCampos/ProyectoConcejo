import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import axios from "axios";
import "./news.css";

import API from "../../config/apiConfig";

function GetNewsPublic() {
  const [news, setNews] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();

  const [visibleCards, setVisibleCards] = useState(6);

  const handleShowMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 6);
  };

  const handleShowLessCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards - 6);
  };


  useEffect(() => {
    getAllNews();
  }, []);

  const handleSeeNew = (item) => {
    navigate(`noticia/${item.id}`,{state: {newsList: news} })
  };

  const getAllNews = async () => {
    try {
      let headersList = {
        "Content-Type": "application/json",
      };
      let reqOptions = {
        url: API.NEWS_PUBLIC,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);
      
      
      setNews(response.data);
      console.log(response.data);

    } catch (error) {
      if(error.response){
        setToastMessage("Error al obtener los banners");
        setShowErrorToast(true);
      }
     
    }
  };

  return (
    <div>
      
      <div className="news-container">
        <div className="title-news">
        <p >Noticias</p>
        </div>

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
      
          
        
      </div>


      {/* Toast error */}
      <ToastContainer position="top-end" className="p-3">
          <Toast
            bg="danger"
            onClose={() => setShowErrorToast(false)}
            show={showErrorToast}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
    </div>
  );
}

export default GetNewsPublic;

