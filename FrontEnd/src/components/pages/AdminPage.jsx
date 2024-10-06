
import NavAdmin from "../adminPage/navAdmin/NavAdmin";
import GetUsers from "../adminPage/getUsers/GetUsers";

function AdminPage() {
    return(

        <>
            <NavAdmin/>
            <div>
                <GetUsers/>
            </div>
           
        </>
    );
}
export default AdminPage;