import CargarNormativas from "../asesorConcejalPage/normativas/CargarNormativa";
import Perfil from "../asesorConcejalPage/perfil/Perfil";
import ListRegulations from "../asesorConcejalPage/regulations/ListRegulations";

import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";

function AsesorConcejalPage() {
  return (
    <>
      <NavbarForRole />

      <Routes>
        <Route path="" element={<ListRegulations />} />
        <Route path="cargar-normativa" element={<CargarNormativas />} />
        <Route path="modificar-normativa/:id" element={<ModificarNormativa />} />
        <Route path="perfil" element={<Perfil />} />
      </Routes>
    </>
  );
}
export default AsesorConcejalPage;
