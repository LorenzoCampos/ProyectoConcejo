import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import "./navbar.css";

function NavBar(onHomeClick) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  

  return (
    <div className="nav-cont">
      <Navbar expand="lg" className="bg-navbar fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/"><img className="logo" src="public/logo1.png" alt="Logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="links">
              <Nav.Link as={Link} to="/" className='link-nav' onClick={onHomeClick}>Home</Nav.Link>
              <Nav.Link as={Link} to="/normativas" className='link-nav'>Normativas</Nav.Link>
              {isAuthenticated ? (
                <>
                  {role === "admin" && <Nav.Link as={Link} to="/admin" className='link-nav'>Admin Panel</Nav.Link>}
                  {role === "concejal" && <Nav.Link as={Link} to="/secretario-concejal" className='link-nav'>Concejal Panel</Nav.Link>}
                  {role === "cm" && <Nav.Link as={Link} to="/cm" className='link-nav'>CM Panel</Nav.Link>}
                  {role === "secretario" && <Nav.Link as={Link} to="/secretario-concejal" className='link-nav'>Secretario Panel</Nav.Link>}
                
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
