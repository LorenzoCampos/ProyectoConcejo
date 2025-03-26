/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';

/* Global CSS */
import './index.css';

/* Home */
import NavBar from "./navbar/Navbar";
import Banner from "./banner/Banner";
import Social from "./social/Social";
import Contact from "./contact/Contact";
import Footer from "./footer/Footer";
import Home from "./pages/Home";

/* Profile */
import Profile from "./profile/Profile";
import EmailVerified from "./pages/EmailVerified";

/* Busqueda de Normativas */
import Normativas from "./pages/Normativas";
import SearchFilter from "./searchFilter/SearchFilter";

/* Login / Logout */
import Access from "./pages/Access";
import Login from "./login/Login";
import Logout from "./logout/Logout";
import ForgotPassword from "./login/forgotPassword/ForgotPassword";

/* Reset Password */
import ResetPassword from "./login/resetPassword/ResetPassword";

/* AdminPage */
import AdminPage from "./pages/AdminPage"
import ListUsers from "./adminPage/listUsers/ListUsers"

/* CMPage */
import CMPage from "./pages/CMPage"
import BannerCM from "./cmPage/bannerCM/BannerCM";

/* AsesorConcejalPage */
import AsesorConcejalPage from "./pages/AsesorConcejalPage";

export{
    Home,
    Normativas,
    Access,
    Profile,
    EmailVerified,
    NavBar,
    Banner,
    Social,
    Contact,
    SearchFilter,
    Login,
    ForgotPassword,
    ResetPassword,
    Footer,
    Logout,
    AdminPage,
    CMPage,
    AsesorConcejalPage,
    ListUsers,
    BannerCM
}