import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../config/apiConfig";
import "./contact.css";

function Contact() {
  const [images, setImages] = useState({ image_left: "", image_right: "" });

  const getContacts = async () => {
    try {
      let headersList = {
        "Content-Type": "application/json",
      };

      let reqOptions = {
        url: API.GET_CONTACT,
        method: "GET",
        headers: headersList,
      };

      const response = await axios.request(reqOptions);

      if (response.status === 200) {
        setImages(response.data[0]);
      }
    } catch (error) {
      if (error.response) {
        console.log("Error al obtener las imagenes.");
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      <div className="news-container">
        <div className="title-news">
          <p>Contacto</p>
        </div>
        <div className="container-forms">
          {images.image_left && images.image_right ? (
            <>
              <div className="form">
                <img src={images.image_left} alt="Imagen Izquierda" />
              </div>
              <div className="form">
                <img src={images.image_right} alt="Imagen derecha" />
              </div>
            </>
          ) : (
            <p>Cargando imagenes...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Contact;
