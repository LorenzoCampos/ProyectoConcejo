import Carousel from "react-bootstrap/Carousel";

import "./banner.css";

function Banner({ banners }) {
  return (
    <>
      <div className="banner">
        <Carousel>
          {banners.map((banner) => (
            <Carousel.Item key={banner.id}>
              <img src={banner.image}  />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default Banner;

