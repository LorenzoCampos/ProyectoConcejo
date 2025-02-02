import GetUsers from "../adminPage/getUsers/GetUsers";
import Register from "../adminPage/register/Register";
import Perfil from "../cmPage/perfil/Perfil";
import NavbarForRole from "../navbar/NavbarForRole";
import { Routes, Route } from "react-router-dom";
import CargarNormativa from "../asesorConcejalPage/normativas/CargarNormativa";
import ModificarNormativa from "../asesorConcejalPage/modificarNormativa/ModificarNormativa";

import VerNormativas from "../asesorConcejalPage/regulations/ListRegulations";

function AdminPage() {
  return (
    <>
      <NavbarForRole />
      <Routes>
        <Route path="" element={<VerNormativas />} />
        <Route path="cargar-normativa" element={<CargarNormativa />} />
        <Route path="modificar-normativa/:id" element={<ModificarNormativa />} />
        <Route path="gestionar-usuarios" element={<GetUsers />} />
        <Route path="registrar-usuario" element={<Register />} />
        <Route path="perfil" element={<Perfil />} />
      </Routes>
    </>
  );
}

export default AdminPage;
