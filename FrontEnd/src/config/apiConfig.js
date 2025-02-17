// apiConfig.js

const URL = "http://200.45.208.190/api/v1";

const API = {
  // Login & logout
  LOGIN: `${URL}/login`,
  LOGOUT: `${URL}/logout`,

  // Admin
  LIST_USERS: `${URL}/users/non-admin`,
  CREATE_USERS: `${URL}/register`,
  UPDATE_ROLE: `${URL}/users/userId/role`,

  //CM
  // Banners
  LIST_BANNERS: `${URL}/banners`,
  CREATE_BANNERS: `${URL}/news-banners`,
  UPDATE_BANNERS: `${URL}/news-banners/`,
  DELETE_BANNERS: `${URL}/news-banners/`,

  // News
  LIST_NEWS: `${URL}/news`,
  CREATE_NEWS: `${URL}/news-banners`,
  UPDATE_NEWS: `${URL}/news-banners/`,
  DELETE_NEWS: `${URL}/news-banners/`,

  //User
  LIST_NEWS_USER: `${URL}/news/published`,

  //Regulations
  LIST_REGULATIONS: `${URL}/regulations`, // Lista de Normativas
  SHOW_REGULATION: `${URL}/regulations/`, // Vista de una Sola Normativa
  CREATE_REGULATIONS: `${URL}/regulations`, // Crear Normativa
  UPDATE_REGULATIONS: `${URL}/regulations/` // Modificar Normativa

};

export default API;
