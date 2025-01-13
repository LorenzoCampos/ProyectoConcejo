import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  // Si no hay token, redirige al Home
  if (!token) {
    console.warn("No se encontró token. Redirigiendo al Home.");
    return <Navigate to="/" />;
  }

  // Si el rol del usuario no está en la lista de roles permitidos, redirige al Home
  if (!roles.includes(userRole)) {
    console.warn(`El rol del usuario (${userRole}) no tiene acceso a esta ruta.`);
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;


