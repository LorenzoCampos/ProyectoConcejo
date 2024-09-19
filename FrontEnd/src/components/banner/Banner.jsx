import Carousel from 'react-bootstrap/Carousel';

import "./banner.css";

function Banner() {
  return (
  <>
   <div className="banner">
          <Carousel>
            <Carousel.Item >
              <img src="public/foto1.png" alt="Logo" />
            </Carousel.Item>

            <Carousel.Item  className="carousel-item">
              <img src="public/foto2.jpg" alt="Logo" />
            </Carousel.Item>
          </Carousel>
        </div>

        
  </>
  );
}

export default Banner;
