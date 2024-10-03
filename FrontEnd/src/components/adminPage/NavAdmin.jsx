import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';



import "./navAdmin.css";

function NavAdmin() {
    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
          setRole(storedRole);
        }
      }, []);
  return (
    <>
    <div className="nav-admin">
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand as={Link} to="/"><img className="logo" src="public/logo1.png" alt="Logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <NavDropdown title={role || "Usuario"} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
         
        </Navbar.Collapse>
      </Container>
    </Navbar>

    </div>
        
       
    </>
  );
}

export default NavAdmin;