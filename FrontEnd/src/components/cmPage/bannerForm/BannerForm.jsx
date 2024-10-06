import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

import { useState } from "react";

import axios from "axios";

import "./bannerForm.css";

const API = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/api/banner/create";

function BannerForm() {

  /* const [showSuccessToast, setShowSuccessToast] = useState(false); */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      let headersList = {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        image1: formData.get("image1"),
        image2: formData.get("image2"),
        image3: formData.get("image3"),
      });

      const response = await axios.post(API, bodyContent,
        { headers: headersList });

      if (response.status === 200) {
        let message = "Banner creado correctamente.";
        setToastMessage(message);
        setShowSuccessToast(true);
      }

    } catch (error) {
      let message = "Error al crear el banner.";
      setToastMessage(message);
      setShowErrorToast(true);
    }
  };

  return (
    <div className="form-container">
      <div className="banner-form">
        <h2>Crear nuevo banner</h2>

        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="form-label">Imagen 1:</Form.Label>
            <Form.Control
              type="file"
              name="image1"
              onChange={(e) => e.target.value}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="form-label">Imagen 2:</Form.Label>
            <Form.Control
              type="file"
              name="image2"
              onChange={(e) => e.target.value}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="form-label">Imagen 3:</Form.Label>
            <Form.Control
              type="file"
              name="image3"
              onChange={(e) => e.target.value}
            />
          </Form.Group>

          <div className="btn-container">
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Crear Banner
            </Button>
          </div>
        </Form>
      </div>



    </div>
  );
}

export default BannerForm;