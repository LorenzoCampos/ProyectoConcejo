// apiConfig.js

const URL = "https://api-concejoarroyoseco.duckdns.org/api/v1";

const API = {
  // Banners Public
  BANNERS_PUBLIC: `${URL}/banners/published`,

  // News Public
  NEWS_PUBLIC: `${URL}/news/published`,

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

  //Regulations
  LIST_REGULATIONS: `${URL}/regulations`, // Lista de Normativas
  SHOW_REGULATION: `${URL}/regulations/`, // Vista de una Sola Normativa
  CREATE_REGULATIONS: `${URL}/regulations`, // Crear Normativa
  UPDATE_REGULATIONS: `${URL}/regulations/` // Modificar Normativa

};

export default API;
