import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PrivateRoute from "./PrivateRoute";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import ForgotPassword from "./components/login/forgotPassword/ForgotPassword";
import ResetPassword from "./components/login/resetPassword/ResetPassword";
import EmailVerified from "./components/pages/EmailVerified";
import { AdminPage, AsesorConcejalPage, CMPage } from "./components";
import SeeNew from "./components/news/SeeNew";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/normativas" element={<Normativas />} />
          <Route path="/login" element={<Access />} />
          <Route path="/verified/:status" element={<EmailVerified />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />

           {/* 🔹 Nueva ruta para la noticia individual */}
          <Route path="/news/:id" element={<SeeNew />} />

          <Route path="/admin/*" element={<PrivateRoute roles="admin"><AdminPage /></PrivateRoute>} />
          <Route path="/cm/*" element={<PrivateRoute roles="cm"><CMPage /></PrivateRoute>} />
          <Route path="/asesor-concejal/*" element={<PrivateRoute roles={['concejal', 'asesor', 'mesa']}><AsesorConcejalPage /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;