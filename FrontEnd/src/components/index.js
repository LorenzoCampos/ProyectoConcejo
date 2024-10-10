/* Home */
import NavBar from "./navbar/Navbar";
import Banner from "./banner/Banner";
import News from "./news/News";
import Social from "./social/Social";
import Contact from "./contact/Contact";
import Footer from "./footer/Footer";
import Home from "./pages/Home";

/* Busqueda de Normativas */
import Normativas from "./pages/Normativas";
import SearchFilter from "./searchFilter/SearchFilter";

/* Login / Logout */
import Access from "./pages/Access";
import Login from "./login/Login";
import Logout from "./logout/Logout";

/* AdminPage */
import AdminPage from "./pages/AdminPage"
import NavAdmin from "./adminPage/navAdmin/NavAdmin";
import GetUsers from "./adminPage/getUsers/GetUsers"

/* CMPage */
import CMPage from "./pages/CMPage"
import BannerCM from "./cmPage/bannerCM/BannerCM";

/* ConcejalPage */
import ConcejalPage from "./pages/ConcejalPage"

/* UserPage */
import UserPage from "./pages/UserPage"

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';


export{
    Home,
    Normativas,
    Access,
    NavBar,
    Banner,
    News,
    Social,
    Contact,
    SearchFilter,
    Login,
    Footer,
    Logout,
    AdminPage,
    CMPage,
    ConcejalPage,
    UserPage,
    NavAdmin,
    GetUsers,
    BannerCM
}