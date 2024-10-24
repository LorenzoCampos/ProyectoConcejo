import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "../bannerForm/preview.css";

function PreviewNews({ isOpen, closeModal, file, title, description }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  return (
    <div>
      {isOpen && (
        <div className="modal-background">
          <div className="bannerModal">
            <div className="title-close">
              <div className="title">
                <h1>Vista Previa</h1>
              </div>
              <div className="btn-close-modal">
                <button onClick={closeModal} className="btnClose">
                  <IoMdClose />
                </button>
              </div>
            </div>
            <div className="banner-prev">
              {imagePreview && (
                <Card style={{ width: "18rem", margin: "0 auto" }}>
                  <Card.Img variant="top" src={imagePreview} alt="Preview" />
                  <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                      {description}
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

export default PreviewNews;
