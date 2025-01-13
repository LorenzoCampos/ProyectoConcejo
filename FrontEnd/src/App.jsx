
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
            
            {/* <Route path="/admin/*" element={ <PrivateRoute role="admin"></PrivateRoute>} />
            <Route path="/concejal/*" element={ <PrivateRoute role="concejal"></PrivateRoute>} />
            <Route path="/cm/*" element={ <PrivateRoute role="cm"></PrivateRoute>} />
            <Route path="/secretario" element={ <PrivateRoute role="secretario"></PrivateRoute>} /> */}

            <Route path="/admin/*" element={ <PrivateRoute roles="admin"><AdminPage/></PrivateRoute>} />
            <Route path="/cm/*" element={ <PrivateRoute roles="cm"><CMPage/></PrivateRoute>} />

            <Route path="/cargar-normativa" element={ <PrivateRoute roles={['concejal', 'secretario', 'admin']}></PrivateRoute>} />
            <Route path="/ver-normativas" element={ <PrivateRoute roles={['concejal', 'secretario', 'admin']}></PrivateRoute>} />

            <Route path="/gestionar-usuarios" element={ <PrivateRoute roles="admin"></PrivateRoute>} />
            <Route path="/registrar-usuario" element={ <PrivateRoute roles="admin"></PrivateRoute>} />

            <Route path="/ver-banners" element={ <PrivateRoute roles="cm"></PrivateRoute>} />
            <Route path="/cargar-banner" element={ <PrivateRoute roles="cm"></PrivateRoute>} />
            <Route path="/ver-noticias" element={ <PrivateRoute roles="cm"></PrivateRoute>} />
            <Route path="/cargar-boticia" element={ <PrivateRoute roles="cm"></PrivateRoute>} />

          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
