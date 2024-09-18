import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Carousel from 'react-bootstrap/Carousel';


import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import "./home.css";

function Home() {
  return (
    <>
      <div className="home">
        <Navbar bg="light" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="#home">
              {" "}
              <img className="logo" src="public/logo1.png" alt="Logo" />{" "}
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Normativas</Nav.Link>
              <Nav.Link href="#pricing">Acceso a funcionarios</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <div className="carousel">
          <Carousel>
            <Carousel.Item >
              <img src="public/logo1.png" alt="Logo" />
              
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item  className="carousel-item">
              <img src="public/logo1.png" alt="Logo" />
              
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            
          </Carousel>
        </div>

        <div className="tarjetas">
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />

            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />

            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />

            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the cards content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Home;
