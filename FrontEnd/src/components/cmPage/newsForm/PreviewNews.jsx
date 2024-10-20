import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "./preview.css";


function Preview({ isOpen, closeModal, file }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview([reader.result]); // Convertir a array para el carrusel
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  return (
    <div>
      {isOpen && (
        <div className='modal-background'>
          <div className='bannerModal'>
            <div className='title-close'>
              <div className="title">
                <h1>Vista Previa</h1>
              </div>
              <div className="btn-close-modal">
                <button onClick={closeModal} className='btnClose'><IoMdClose /></button>
              </div>
            </div>
            <div className="new">
              {imagePreview && (
               <Card style={{ width: '18rem', margin: '0 auto' }}>
               <Card.Img variant="top" src={imagePreview} alt="Preview" />
               <Card.Body>
                 <Card.Title>Vista Previa de Noticia</Card.Title>
                 <Card.Text>
                   Aquí puedes agregar más detalles sobre la noticia, como el estado o las fechas.
                 </Card.Text>
               </Card.Body>
             </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;