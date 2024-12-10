import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';



import "./navConcejal.css";

import Logout from '../../logout/Logout';

function NavConcejal() {
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

              <NavDropdown.Item as={Link} to="/">
                Volver al Home
              </NavDropdown.Item>
              
              <NavDropdown.Item as={Link} to="/concejal/perfil">
                Ver Perfil
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/concejal/normativas">
                Cargar Normativas
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

export default NavConcejal;