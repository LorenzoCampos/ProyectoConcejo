import LoadRegulations from "../asesorConcejalPage/loadRegulation/LoadRegulation";
import ListRegulations from "../asesorConcejalPage/listRegulations/ListRegulations";

import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";

function AsesorConcejalPage() {
  return (
    <>
      <NavbarForRole />

      <Routes>
        <Route path="" element={<ListRegulations />} />
        <Route path="cargar-normativa" element={<LoadRegulations />} />
        <Route path="modificar-normativa/:id" element={<ModificarNormativa />} />
      </Routes>
    </>
  );
}
export default AsesorConcejalPage;
