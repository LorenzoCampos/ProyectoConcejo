import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PrivateRoute from "./PrivateRoute";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import {AdminPage, SecretarioConcejalPage, CMPage} from "./components";




function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/normativas" element={<Normativas />} />
            <Route path="/login" element={<Access />} />

            <Route path="/admin/*" element={ <PrivateRoute roles="admin"><AdminPage/></PrivateRoute>} />
            <Route path="/cm/*" element={ <PrivateRoute roles="cm"><CMPage/></PrivateRoute>} />
            <Route path="/secretario-concejal/*" element={ <PrivateRoute roles={['concejal', 'secretario']}><SecretarioConcejalPage/></PrivateRoute>} />

          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
