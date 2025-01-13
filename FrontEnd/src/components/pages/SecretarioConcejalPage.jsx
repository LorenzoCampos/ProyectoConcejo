import NavConcejal from "../concejalPage/navConcejal/NavConcejal";
import CargarNormativas from "../concejalPage/normativas/CargarNormativa";
import Perfil from "../concejalPage/perfil/Perfil";
import ListRegulations from "../concejalPage/regulations/ListRegulations";

import { Routes, Route } from "react-router-dom";
import NavbarForRole from "../navbar/NavbarForRole";


function SecretarioConcejalPage() {
    return(

        <>
        <NavbarForRole/>
        <NavConcejal/>

        <Routes>
            <Route path="" element={<ListRegulations/>}/>
            <Route path="cargar-normativas" element={<CargarNormativas/>}/>
            <Route path="perfil" element={<Perfil/>}/>
        </Routes>
        </>
    );
}
export default SecretarioConcejalPage;