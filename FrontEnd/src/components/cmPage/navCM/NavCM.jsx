import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

import "./navCM.css";

import Logout from "../../logout/Logout";


function NavCM({onBannerFormClick, onBannersListClick, onNewsListClick, onNewsFormClick}) {
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
              <NavDropdown title={name || "Usuario"} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={onBannersListClick}>
                  Ver Banners
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onBannerFormClick}>
                  Cargar Banner
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onNewsListClick}>
                  Ver Noticias
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onNewsFormClick}>
                  Cargar Noticia
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Logout />
                </NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

    
    </>
  );
}

export default NavCM;
