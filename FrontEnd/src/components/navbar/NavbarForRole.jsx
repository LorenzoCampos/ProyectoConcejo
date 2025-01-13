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
    setUserRole(userRole);

    if (storedName) {
      const formattedName = storedName.split(" ").join("+"); // Formatear nombre para URL
      setAvatar(
        `https://ui-avatars.com/api/?name=${formattedName}&background=BE9A60&color=ffffff&size=50&rounded=true`
      );
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
            <img className="logo" src="public/logo1.png" alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                
                {userRole === "concejal" || userRole === "secretario" && (
                  <>
                    <Nav.Link as={Link} to="">Ver Normativas</Nav.Link>
                    <Nav.Link as={Link} to="cargar-normativa">Cargar normativa</Nav.Link>
                    
                  </>
                )}
                {userRole === "admin" && (
                  <>
                    <Nav.Link as={Link} to="ver-normativas">Ver Normativas</Nav.Link>
                    <Nav.Link as={Link} to="cargar-normativa">Cargar normativa</Nav.Link>
                    <Nav.Link as={Link} to="">Gestionar Usuarios</Nav.Link>
                    <Nav.Link as={Link} to="registrar-usuario">Registrar Usuario</Nav.Link>
                  </>
                )}
                {userRole === "cm" && (
                  <>
                    <Nav.Link as={Link} to="ver-banners">Gestionar Banners</Nav.Link>
                    <Nav.Link as={Link} to="">Gestionar Noticias</Nav.Link>
                  </>
                )}

                <NavDropdown
              title={
                <div className="user-info">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="avatar" />
                  ) : (
                    <FaRegUserCircle className="default-avatar" /> && name
                  )}
                </div>
              }
              id="user-dropdown"
              align="end"
            > 
              <NavDropdown.Item >
                Ver Perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarForRole;
