import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';



import "./navAdmin.css";
import Register from '../register/Register';
import Logout from '../../logout/Logout';

function NavAdmin() {
  const [role, setRole] = useState('');
 const [showRegister, setShowRegister] = useState(false);


  
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
          setRole(storedRole);
        }
      }, []);


      const handleRegisterClick = () => {
        setShowRegister(true);  
    };
  return (
    <>
    <div className="nav-admin">
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand as={Link} to="/"><img className="logo" src="public/logo1.png" alt="Logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <NavDropdown title={role || "Usuario"} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleRegisterClick}>Registrar un nuevo usuario</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
              <Logout />
              </NavDropdown.Item>
            </NavDropdown>
         
        </Navbar.Collapse>
      </Container>
      
    </Navbar>

    </div>
        
    {showRegister && <Register />}

    </>
  );
}

export default NavAdmin;