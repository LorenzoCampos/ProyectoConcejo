import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams } from "react-router-dom";
import "./home.css";

function EmailVerified() {
  const { status } = useParams();

  return (
    <>
      <Navbar />
      <div className="page-home">
        {status === "success" ? (
          <h1>Email verificado correctamente</h1>
        ) : (
          <h1>Error en la verificación del email</h1>
        )}
      </div>
      <Footer />
    </>
  );
}

export default EmailVerified;