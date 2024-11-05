
import { useState } from "react";
import NavAdmin from "../adminPage/navAdmin/NavAdmin";
import GetUsers from "../adminPage/getUsers/GetUsers";
import Register from "../adminPage/register/Register";

function AdminPage() {
    /*const [showRegister, setShowRegister] = useState(false); 

    const handleShowRegister = (value) => {
        setShowRegister(value);
    };
*/
const[currentView, setCurrentView]= useState('listUsers');

const handleShowListUsers = ()=> {
    setCurrentView('listUsers')
};

const handleShowRegister = ()=>{
    setCurrentView('register')
}

    return (
        <>
        <NavAdmin
        onRegisterClick= {handleShowRegister}
        onSeeUsersClick= {handleShowListUsers}
        />

           {currentView === 'listUsers'&& <GetUsers/>}
           {currentView === 'register'&& <Register/>}
        </>
    );
}

export default AdminPage;