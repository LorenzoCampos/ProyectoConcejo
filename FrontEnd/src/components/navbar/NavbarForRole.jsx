import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import Logout from "../logout/Logout";

function NavbarForRole() {
  const [userRole, setUserRole] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");
    console.log("Stored Name:", storedName);
    console.log("User Role:", userRole);
    setUserRole(userRole);

    if (storedName) {
      setName(storedName);
      const formattedName = storedName.split(" ").join("+");

      console.log("Formatted Name for Avatar:", formattedName);

      const avatarUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=BE9A60&color=ffffff&size=50&rounded=true`;
      console.log("Avatar URL:", avatarUrl);

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

            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} onClick={() => setShowOffcanvas(true)} />

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
                  {(userRole === "concejal" ||
                    userRole === "asesor" ||
                    userRole === "mesa de entrada" ||
                    userRole === "admin") && (
                    <>
                      <Nav.Link
                        as={Link}
                        to=""
                        className="link-nav"
                        style={{ fontSize: "1rem" }}
                        onClick={() => handleLinkClick("/normativas")}
                      >
                        Ver Normativas
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="cargar-normativa"
                        className="link-nav"
                        style={{ fontSize: "1rem" }}
                        onClick={() => handleLinkClick("/cargar-normativa")}
                      >
                        Cargar normativa
                      </Nav.Link>
                    </>
                  )}

                  {userRole === "admin" && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="gestionar-usuarios"
                        className="link-nav"
                        style={{ fontSize: "1rem" }}
                        onClick={() => handleLinkClick("/gestionar-usuarios")}
                      >
                        Gestionar Usuarios
                      </Nav.Link>
                    </>
                  )}

                  {userRole === "cm" && (
                    <>
                      <Nav.Link
                        as={Link}
                        to=""
                        className="link-nav"
                        style={{ fontSize: "1rem" }}
                        onClick={() => handleLinkClick("/gestionar-banners")}
                      >
                        Gestionar Banners
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="ver-noticias"
                        className="link-nav"
                        style={{ fontSize: "1rem" }}
                        onClick={() => handleLinkClick("/ver-noticias")}
                      >
                        Gestionar Noticias
                      </Nav.Link>
                    </>
                  )}

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
                      <NavDropdown.Item as={Link} to="/" onClick={() => handleLinkClick("/")}>
                        Volver al Home
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Logout />
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                  <div className="d-block d-sm-none">
                    <Nav.Link as={Link} to="/" onClick={() => handleLinkClick("/")}>
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
    </>
  );
}

export default NavbarForRole;