import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import "./navAdmin.css";
import Logout from "../../logout/Logout";
import { useState, useEffect } from "react"
import Nav from "react-bootstrap/Nav";

function NavAdmin({ onRegisterClick, onSeeUsersClick }) {  
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
              <NavDropdown title={name || "Usuario"} id="basic-nav-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/"> 
                  Home
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onSeeUsersClick}>
                  Ver usuarios
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onRegisterClick}>
                  Registrar un nuevo usuario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
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

export default NavAdmin;
