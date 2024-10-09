
import { IoMdClose } from "react-icons/io";

import GetBannersCM from "../getBanners/GetBannersCM";
import "./preview.css"



function Preview({isOpen, closeModal}) {

  return (
    <div>
      {isOpen &&
        <div className='modal-background'>
          <div className='bannerModal'>
            <div className='title-close'>
                <div className="title">
                <h1>Vista  Previa</h1>
                </div>
           
            <div className="btn-close-modal">
            <button onClick={closeModal} className='btnClose'><IoMdClose /></button>
            </div>
            
            </div>  
            <div>
            <GetBannersCM renderBanners={true}/>
            </div>
           
            </div>
        </div>
      }
    </div>
      
  );
}

export default Preview;