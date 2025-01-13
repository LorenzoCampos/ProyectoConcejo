import CargarNormativas from "../secretarioConcejalPage/normativas/CargarNormativa";
import Perfil from "../secretarioConcejalPage/perfil/Perfil";
import ListRegulations from "../secretarioConcejalPage/regulations/ListRegulations";

import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";


function SecretarioConcejalPage() {
    return(

        <>
        <NavbarForRole/>

        <Routes>
            <Route path="" element={<ListRegulations/>}/>
            <Route path="cargar-normativa" element={<CargarNormativas/>}/>
            <Route path="perfil" element={<Perfil/>}/>
        </Routes>
        </>
    );
}
export default SecretarioConcejalPage;