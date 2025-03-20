import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Logout from "../logout/Logout";
import "./navbar.css";
import axios from "axios";
import API from "../../config/apiConfig";

function NavbarForRole() {
  const [userRole, setUserRole] = useState("");
  const [name, setName] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  
  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");
    setUserRole(userRole);
    const verifiedEmail = localStorage.getItem("email_verified");
    setVerifiedEmail(verifiedEmail);

    if (storedName) {
      setName(storedName);
      const formattedName = storedName.split(" ").join("+");

      /* console.log("Formatted Name for Avatar:", formattedName); */

      const avatarUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=BE9A60&color=ffffff&size=50&rounded=true`;
      /* console.log("Avatar URL:", avatarUrl); */

      setAvatar(avatarUrl);
    } else {
      setAvatar("");
      setName("Usuario");
    }
  }, []);

  const handleLinkClick = (path) => {
    navigate(path);
    setShowOffcanvas(false);
  };

  const handleEmailVerified = async () => {
    try {
      const response = await axios.post(API.EMAIL_VERIFICATION, status, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });

      if (response.data.status === "verification-link-sent") {
        setToastMessage("Email de verificación enviado correctamente.");
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Error al enviar el email de verificación.");
      setShowErrorToast(true);
    }
  };

  const getBasePath = (userRole) => {
    const rolePaths = {
      concejal: "/asesor-concejal",
      asesor: "/asesor-concejal",
      admin: "/admin",
      mesa: "/asesor-concejal",
      cm: "/cm",
    };

    return rolePaths[userRole] || "/"; // Fallback a "/" si el rol no existe
  };

  return (
    <>
      <div className="nav-cont">
        <Navbar
          key="sm"
          expand="sm"
          className="bg-body-tertiary mb-3 fixed-top"
        >
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <img className="logo" src="/assets/logo1.png" alt="Logo" />
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-sm`}
              onClick={() => setShowOffcanvas(true)}
            />

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-sm`}
              aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
              placement="end"
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                  <div className="user-info">
                    {avatar ? (
                      <img src={avatar} alt="User Avatar" className="avatar" />
                    ) : (
                      <FaRegUserCircle className="default-avatar" />
                    )}
                    <span className="user-name">{name}</span>
                  </div>
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <div className="container-nav-link d-flex flex-column flex-sm-row">
                    {(userRole === "concejal" ||
                      userRole === "asesor" ||
                      userRole === "mesa" ||
                      userRole === "admin") && (
                      <>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Ver Normativas
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}/cargar-normativa`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Cargar normativa
                        </Nav.Link>
                      </>
                    )}

                    {userRole === "admin" && (
                      <>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}/gestionar-usuarios`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Gestionar Usuarios
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}/cargar-orden-dia`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Generar Orden del Dia
                        </Nav.Link>
                      </>
                    )}

                    {userRole === "cm" && (
                      <>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Gestionar Banners
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}/gestionar-noticias`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Gestionar Noticias
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to={`${getBasePath(userRole)}/cargar-contactos`}
                          className="link-nav"
                          style={{ fontSize: "1rem" }}
                        >
                          Cargar Contactos
                        </Nav.Link>
                      </>
                    )}
                  </div>
                  <div className="d-none d-sm-block">
                    <NavDropdown
                      title={
                        <div className="user-info">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt="User Avatar"
                              className="avatar"
                            />
                          ) : (
                            <>
                              <FaRegUserCircle className="default-avatar" />
                              <span className="user-name">{name}</span>
                            </>
                          )}
                        </div>
                      }
                      id="user-dropdown"
                      align="end"
                    >
                      {verifiedEmail === "false" && (
                        <NavDropdown.Item onClick={handleEmailVerified}>
                          Verificar Email
                        </NavDropdown.Item>
                      )}

                      <NavDropdown.Item
                        as={Link}
                        to={`${getBasePath(userRole)}/profile`}
                      >
                        Ver Perfil
                      </NavDropdown.Item>

                      <NavDropdown.Item onClick={() => handleLinkClick("/")}>
                        Volver al Home
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Logout />
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                  <div className="d-block d-sm-none align-self-center">
                    <Nav.Link
                      as={Link}
                      to="/"
                      onClick={() => handleLinkClick("/")}
                    >
                      Volver al Home
                    </Nav.Link>
                    <Nav.Link>
                      <Logout />
                    </Nav.Link>
                  </div>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </div>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>

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
    </>
  );
}

export default NavbarForRole;
