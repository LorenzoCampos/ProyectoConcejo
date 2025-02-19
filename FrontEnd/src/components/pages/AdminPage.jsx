import ListUsers from "../adminPage/listUsers/ListUsers";
import Register from "../adminPage/register/Register";
import NavbarForRole from "../navbar/NavbarForRole";
import { Routes, Route } from "react-router-dom";
import LoadRegulation from "../asesorConcejalPage/loadRegulation/LoadRegulation";
import ModificarNormativa from "../asesorConcejalPage/modificarNormativa/ModificarNormativa";

import VerNormativas from "../asesorConcejalPage/listRegulations/ListRegulations";
import Details from "../asesorConcejalPage/regulationDetails/Details";

function AdminPage() {
  return (
    <>
      <NavbarForRole />
      <Routes>
        <Route path="" element={<VerNormativas />} />
        <Route path="cargar-normativa" element={<LoadRegulation />} />
        <Route path="modificar-normativa/:id" element={<ModificarNormativa />} />
        <Route path="detalles/:id" element={<Details />} />
        <Route path="gestionar-usuarios" element={<ListUsers />} />
        <Route path="registrar-usuario" element={<Register />} />
      </Routes>
    </>
  );
}

export default AdminPage;
