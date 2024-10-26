
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PrivateRoute from "./PrivateRoute";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import {AdminPage, ConcejalPage, CMPage} from "./components";


function App() {
  return (
    <>
      <BrowserRouter>
      
       
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/normativas" element={<Normativas />} />
            <Route path="/login" element={<Access />} />
            
   

            <Route path="/admin" element={ <PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
            <Route path="/concejal" element={ <PrivateRoute role="concejal"><ConcejalPage /></PrivateRoute>} />
            <Route path="/cm" element={ <PrivateRoute role="cm"><CMPage /></PrivateRoute>} />
            <Route path="/secretario" element={ <PrivateRoute role="secretario"><CMPage /></PrivateRoute>} />
            
      
            
          </Routes>
        
       
      </BrowserRouter>
    </>
  );
}

export default App;
