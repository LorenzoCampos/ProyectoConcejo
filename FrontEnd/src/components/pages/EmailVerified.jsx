import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import API from "../../config/apiConfig";
import "./home.css";

function EmailVerified() {
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      localStorage.setItem("email_verified", "true");

      const CloseSession = async () => {
        try {
          let headersList = {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          };

          let reqOptions = {
            url: API.LOGOUT,
            method: "POST",
            headers: headersList,
          };

          const response = await axios.request(reqOptions);

          if (response.status === 200) {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
          } else {
            console.error(error);
          }
        }
      };

      setTimeout(() => {
        CloseSession();
      }, 3000);
    }
  }, [status, navigate]);

  return (
    <>
      <Navbar />
      <div className="page-home">
        {status === "success" ? (
          <div className="content-page-container">
            <h1>Email verificado correctamente</h1>
            <p>Debes iniciar sesion nuevamente.</p>
            <p>Redirigiendo...</p>
          </div>
        ) : (
          <h1>Error en la verificación del email</h1>
        )}
      </div>
      <Footer />
    </>
  );
}

export default EmailVerified;
