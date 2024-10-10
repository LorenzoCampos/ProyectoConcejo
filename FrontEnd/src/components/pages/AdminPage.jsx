
import { useState } from "react";
import NavAdmin from "../adminPage/navAdmin/NavAdmin";
import GetUsers from "../adminPage/getUsers/GetUsers";
import Register from "../adminPage/register/Register";

function AdminPage() {
    const [showRegister, setShowRegister] = useState(false); 

    const handleShowRegister = (value) => {
        setShowRegister(value);
    };

    return (
        <>
            <NavAdmin onRegisterClick={() => handleShowRegister(true)} />
            <div>
                {showRegister ? <Register /> : <GetUsers />}
            </div>
        </>
    );
}

export default AdminPage;