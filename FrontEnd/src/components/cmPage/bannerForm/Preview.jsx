import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "./preview.css";


function Preview({ isOpen, closeModal, file }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview([reader.result]); 
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
            <div className="banner-prev">
              {imagePreview && (
                <Carousel>
                  <Carousel.Item>
                    <img
                      src={imagePreview[0]} // Cambia según el array
                      alt="Preview"
                    />
                  </Carousel.Item>
                </Carousel>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
