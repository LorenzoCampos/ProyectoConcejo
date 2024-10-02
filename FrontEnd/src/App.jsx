
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import {AdminPage, UserPage, ConcejalPage, CMPage} from "./components";

function App() {
  return (
    <>
      <BrowserRouter>
      
       
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/normativas" element={<Normativas />} />
            <Route path="/login" element={<Access />} />

            <Route path="/admin" element={<AdminPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/concejal" element={<ConcejalPage />} />
            <Route path="/cm" element={<CMPage />} />
          </Routes>
        
       
      </BrowserRouter>
    </>
  );
}

export default App;
