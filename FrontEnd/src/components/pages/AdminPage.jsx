
import NavAdmin from "../adminPage/navAdmin";
import Register from "../register/Register"
import GetUsers from "../adminPage/getUsers/GetUsers"

function AdminPage() {
    return(

        <>
        <NavAdmin/>
            <Register/>
            <GetUsers/>
        </>
    );
}
export default AdminPage;