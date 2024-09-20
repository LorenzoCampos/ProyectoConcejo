import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

import "./social.css";

function Social() {
  return (

  <div className="social-media">
    <div className="item">
      <FaInstagram className="icon" />
      <h5>Instagram</h5>
    </div>
    <div className="item">
      <FaFacebook className="icon" />
      <h5>Facebook</h5>
    </div>
  </div>

  );
}

export default Social;