import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role}) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");


   if (!token) {
    console.warn("No se encontró token. Redirigiendo al Home.");
    return <Navigate to="/"  />;
  }

  if (userRole !== role) {
    console.warn(`El rol del usuario (${userRole}) no coincide con el rol esperado (${role}).`);
    return <Navigate to="/"  />;
  }

  return children;
};

export default PrivateRoute;
