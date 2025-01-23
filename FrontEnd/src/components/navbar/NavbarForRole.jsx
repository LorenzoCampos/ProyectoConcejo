import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import Logout from "../logout/Logout";

function NavbarForRole() {
  const [userRole, setUserRole] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

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
      setAvatar("Usuario");
      setName("Usuario");
    }
  }, []);

  return (
    <>
      <Navbar key="sm" expand="sm" className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img className="logo" src="../public/logo1.png" alt="Logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                <div className="user-info">
                  {avatar && avatar !== "Usuario" ? (
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
                  userRole === "secretario" ||
                  userRole === "admin") && (
                  <>
                    <Nav.Link
                      as={Link}
                      to=""
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Ver Normativas
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="cargar-normativa"
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
                      to="gestionar-usuarios"
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Gestionar Usuarios
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="registrar-usuario"
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Registrar Usuario
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
                    >
                      Gestionar Banners
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="ver-noticias"
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Gestionar Noticias
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="cargar-banner"
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Cargar Banner
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="cargar-noticia"
                      className="link-nav"
                      style={{ fontSize: "1rem" }}
                    >
                      Cargar Noticia
                    </Nav.Link>
                  </>
                )}

                <div className="d-none d-sm-block">
                  <NavDropdown
                    title={
                      <div className="user-info">
                        {avatar && avatar !== "Usuario" ? (
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
                    <NavDropdown.Item>Ver Perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">
                      Volver al Home
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Logout />
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
                <div className="d-block d-sm-none">
                  <Nav.Link as={Link} to="/profile">
                    Ver Perfil
                  </Nav.Link>
                  <Nav.Link as={Link} to="/">
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
    </>
  );
}

export default NavbarForRole;
