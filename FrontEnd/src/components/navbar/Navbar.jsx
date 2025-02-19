import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from 'react';
import "./navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { NavDropdown } from "react-bootstrap";
import Logout from "../logout/Logout";

function NavBar(onHomeClick) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

 
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("role");
    setRole(userRole);

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
    <div className="nav-cont">
      <Navbar expand="lg" className="bg-navbar fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/"><img className="logo" src="/assets/logo1.png" alt="Logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="links">
              <Nav.Link as={Link} to="/" className='link-nav' onClick={onHomeClick}>Home</Nav.Link>
              <Nav.Link as={Link} to="/normativas" className='link-nav'>Normativas</Nav.Link>
              {isAuthenticated ? (
                <>
                  {role === "admin" && <Nav.Link as={Link} to="/admin" className='link-nav'>Admin Panel</Nav.Link>}
                  {role === "asesor" && <Nav.Link as={Link} to="/asesor-concejal" className='link-nav'>Asesor Panel</Nav.Link>}
                  {role === "mesa de entrada" && <Nav.Link as={Link} to="/asesor-concejal" className='link-nav'>Mesa de Entrada Panel</Nav.Link>}
                  {role === "concejal" && <Nav.Link as={Link} to="/asesor-concejal" className='link-nav'>Concejal Panel</Nav.Link>}
                  {role === "cm" && <Nav.Link as={Link} to="/cm" className='link-nav'>CM Panel</Nav.Link>}
                  {role === "user" &&
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
                        <NavDropdown.Item as={Link} to="/profile">
                          Perfil
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                          <Logout />
                        </NavDropdown.Item>
                      </NavDropdown>
                    </div>}
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className='link-nav'>Acceso a funcionarios</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
