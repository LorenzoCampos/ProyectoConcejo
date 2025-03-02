import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState, useEffect } from "react";

import axios from "axios";
import "./news.css";
import News from "./News";

import API from "../../config/apiConfig";

function GetNewsPublic({ onSeeNew, setNewsList }) {
  const [news, setNews] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    getAllNews();
  }, []);

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
      setNewsList(response.data);

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
       
        <News news={news} onSeeNew={onSeeNew} />
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