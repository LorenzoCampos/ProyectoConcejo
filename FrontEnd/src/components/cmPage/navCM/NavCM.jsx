import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

import "./navCM.css";

import BannerForm from "../bannerForm/BannerForm";
import Logout from "../../logout/Logout";

function NavCM() {
  const [name, setName] = useState("");
  const [showBannerForm, setShowBannerForm] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleBannerClick = () => {
    setShowBannerForm(true);
  };

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
                <NavDropdown.Item onClick={handleBannerClick}>
                  Cargar nuevo Banner
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  <Logout />
                </NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      {showBannerForm && <BannerForm />}
    </>
  );
}

export default NavCM;
