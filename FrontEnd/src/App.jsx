import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PrivateRoute from "./PrivateRoute";
import Normativas from "./components/pages/Normativas";
import Access from "./components/pages/Access";
import ForgotPassword from "./components/login/forgotPassword/ForgotPassword";
import ResetPassword from "./components/login/resetPassword/ResetPassword";
import EmailVerified from "./components/pages/EmailVerified";
import { AdminPage, AsesorConcejalPage, CMPage, Footer } from "./components";
import OrdenesDelDia from "./components/pages/OrdenesDelDia";
import NewDetail from "./components/pages/NewDetail";


function App() {
  return (
    <>
    <div className="page-container">
    <div className="content">
    <BrowserRouter>
        <Routes>
          {/* Publico */}
          <Route path="/" element={<Home />} />
          <Route path="/normativas" element={<Normativas />} />
          <Route path="/ver-orden-dia" element={<OrdenesDelDia />} />
          <Route path="/login" element={<Access />} />
          <Route path="/verified/:status" element={<EmailVerified />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />

           {/* 🔹 Nueva ruta para la noticia individual */}
          <Route path="/noticia/:id" element={<NewDetail />} />
          

          <Route path="/admin/*" element={<PrivateRoute roles="admin"><AdminPage /></PrivateRoute>} />
          <Route path="/cm/*" element={<PrivateRoute roles="cm"><CMPage /></PrivateRoute>} />
          <Route path="/asesor-concejal/*" element={<PrivateRoute roles={['concejal', 'asesor', 'mesa']}><AsesorConcejalPage /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
</div>
<Footer />
    </div>
      
    </>
  );
}

export default App;