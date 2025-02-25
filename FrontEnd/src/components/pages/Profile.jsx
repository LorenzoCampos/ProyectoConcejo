import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import NavbarForRole from "../navbar/NavbarForRole";

import axios from "axios";
import API from "../../config/apiConfig";

function Profile() {

  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(API.USER_DATA, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          }
        });

        if (response.status === 200) {
          console.log(response.data);
          const userData = response.data;
          setUserName(userData.user.name);
          setUserLastName(userData.user.last_name);
          setUserEmail(userData.user.email);
          setUserRole(userData.role);
          setEmailVerified(userData.email_verified);
        }
      } catch (error) {
        console.error(error);
      }
    }

//     "user": {
//         "name": "Admin",
//         "last_name": null,
//         "email": "admin@email.com",
//         }
//     "role": "admin",
//     "email_verified": true
// }

    fetchUserData();
  }, [localStorage.getItem("authToken")]);

  return (
    <>
      <Navbar />
      <NavbarForRole />
      <div className="page-home">
        <div className="content-page-container">
        <h1 className="internal-title">Perfil</h1>
          <div className="content-form">
            <div>
              <p>Nombre: {userName}</p>
              <p>Apellido: {userLastName ? userLastName : "-"} </p>
              <p>Email: {userEmail}</p>
              <p>Rol: {userRole}</p>
              <p>Email verificado: {emailVerified ? "Sí" : "No"}</p>
            </div>
          </div>
          <div>
            <a href="/change-password"><p>Cambiar contraseña</p></a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
