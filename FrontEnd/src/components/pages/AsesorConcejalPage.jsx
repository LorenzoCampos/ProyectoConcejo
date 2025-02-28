import LoadRegulations from "../asesorConcejalPage/loadRegulation/LoadRegulation";
import ListRegulations from "../asesorConcejalPage/listRegulations/ListRegulations";

import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";
import ModificarNormativa from "../asesorConcejalPage/modificarNormativa/ModificarNormativa";
import Details from "../asesorConcejalPage/regulationDetails/Details";
import Profile from "../profile/Profile";

function AsesorConcejalPage() {
  return (
    <>
      <NavbarForRole />

      <Routes>
        <Route path="" element={<ListRegulations />} />
        <Route path="cargar-normativa" element={<LoadRegulations />} />
        <Route path="modificar-normativa/:id" element={<ModificarNormativa/>} />
        <Route path="detalles/:id" element={<Details/>} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </>
  );
}
export default AsesorConcejalPage;
