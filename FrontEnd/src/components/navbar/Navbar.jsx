import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";



import "./navbar.css";

function NavBar() {
  return (
    <>
    <div className="nav-cont">
    <Navbar expand="lg" className="bg-navbar fixed-top">
      <Container>
        <Navbar.Brand href="#home"><img className="logo" src="public/logo1.png" alt="Logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="links">
            <Nav.Link href="#home"  className='link-nav'>Home</Nav.Link>
              <Nav.Link href="#normativas" className='link-nav'>Normativas</Nav.Link>
              <Nav.Link href="#" className='link-nav'>Acceso a funcionarios</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    </div>
        
       
    </>
  );
}

export default NavBar;