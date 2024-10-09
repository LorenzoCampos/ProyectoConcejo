import Carousel from "react-bootstrap/Carousel";

import "./banner.css";

function BannerCM({ bannerscm }) {
  return (
    <>
      <div className="bannerCM">
        <Carousel>
          {bannerscm.map((banner) => (
            <Carousel.Item key={banner.id}>
              <img src={banner.image}  />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default BannerCM;
