import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

import "./navCM.css";

import Logout from "../../logout/Logout";

function NavCM() {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <>
      <div className="nav-admin">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img className="logo" src="public/logo1.png" alt="Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <NavDropdown
                  title={name || "Usuario"}
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/">
                    Volver al Home
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cm/perfil">
                    Ver Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="">
                    Ver Banners
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cm/cargar-banner">
                    Cargar Banner
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cm/ver-noticias">
                    Ver Noticias
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cm/cargar-noticia">
                    Cargar Noticia
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <Logout />
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default NavCM;
