
import GetUsers from "../adminPage/getUsers/GetUsers";
import Register from "../adminPage/register/Register";
import Perfil from "../cmPage/perfil/Perfil";
import NavbarForRole from "../navbar/NavbarForRole";
import { Routes, Route } from "react-router-dom";
import CargarNormativa from "../concejalPage/normativas/CargarNormativa";
import VerNormativas from "../concejalPage/regulations/ListRegulations";

function AdminPage() {
 


    return (
        <>
        <NavbarForRole/>
        <Routes>
            <Route path="" element= {<GetUsers/>}/>

            <Route path="ver-normativas" element={<VerNormativas/>}/>
            <Route path="cargar-normativa" element={<CargarNormativa/>}/>
            <Route path="registrar-usuario" element={<Register/>}/>
            <Route path="perfil" element={<Perfil />} />
        </Routes>
        </>
    );
}

export default AdminPage;