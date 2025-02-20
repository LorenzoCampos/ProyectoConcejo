import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams } from "react-router-dom";
import "./home.css";

function EmailVerified() {
  const { status } = useParams();

  if (status === "success") {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }

  return (
    <>
      <Navbar />
        <div className="page-home">
          {status === "success" ? (
            <>
              <div className="content-page-container">
                <h1>Email verificado correctamente</h1>
                <p>Redirigiendo...</p>
              </div>
            </>
          ) : (
            <h1>Error en la verificación del email</h1>
          )}
        </div>
      <Footer />
    </>
  );
}

export default EmailVerified;