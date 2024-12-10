import NavConcejal from "../concejalPage/navConcejal/NavConcejal";
import CargarNormativas from "../concejalPage/normativas/CargarNormativas";
import Perfil from "../concejalPage/perfil/Perfil";
import ListRegulations from "../concejalPage/regulations/ListRegulations";

import { Routes, Route } from "react-router-dom";


function ConcejalPage() {
    return(

        <>
        <NavConcejal/>

        <Routes>
            <Route path="" element={<ListRegulations/>}/>
            <Route path="cargar-normativas" element={<CargarNormativas/>}/>
            <Route path="perfil" element={<Perfil/>}/>
        </Routes>
        </>
    );
}
export default ConcejalPage;