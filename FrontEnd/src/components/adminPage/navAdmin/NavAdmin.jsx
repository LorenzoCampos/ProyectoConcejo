import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import "./navAdmin.css";
import Logout from "../../logout/Logout";
import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { FaRegUserCircle } from "react-icons/fa";

function NavAdmin({ onRegisterClick, onSeeUsersClick }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
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
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img className="logo" src="public/logo1.png" alt="Logo" />
        </Navbar.Brand> 
          <Nav className="ms-auto">
            <NavDropdown
              title={
                <div className="user-info">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="avatar" />
                  ) : (
                    <FaRegUserCircle className="default-avatar" />
                  )}
                </div>
              }
              id="user-dropdown"
              align="end"
            >
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
              <NavDropdown.Item>
                <Logout />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
      </Container>
    </Navbar>
  );
}

export default NavAdmin;

