import Carousel from 'react-bootstrap/Carousel';

import "./banner.css";

function Banner({banners}) {
  return (
  <>
   <div className="banner">
          <Carousel>
            {banners.map((banner, index) => (
            <Carousel.Item key={index}>
              <img src={banner.image} alt={`Banner ${index + 1}`}/>
            </Carousel.Item>

    
                 ))} 
         
          </Carousel>
        </div>

        
  </>
  );
}

export default Banner;

       