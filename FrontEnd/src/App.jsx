import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PrivateRoute from "./PrivateRoute";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import Profile from "./components/pages/Profile";
import EmailVerified from "./components/pages/EmailVerified";
import { AdminPage, AsesorConcejalPage, CMPage } from "./components";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/normativas" element={<Normativas />} />
          <Route path="/login" element={<Access />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verified/:status" element={<EmailVerified />} />

          <Route path="/admin/*" element={<PrivateRoute roles="admin"><AdminPage /></PrivateRoute>} />
          <Route path="/cm/*" element={<PrivateRoute roles="cm"><CMPage /></PrivateRoute>} />
          <Route path="/asesor-concejal/*" element={<PrivateRoute roles={['concejal', 'asesor']}><AsesorConcejalPage /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;