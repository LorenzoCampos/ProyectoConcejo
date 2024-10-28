# BACKEND DOCUMENTATION

## Resouces

For basic API resources:
 - Sanctum

For email verification and password resetting:
 - Breeze

For roles and **permission**s:
 - Spatie

# USUARIOS DE PRUEBA

{
    "name": "nameUser",
    "email": "user@email.com",
    "email_confirmation": "user@email.com",
    "password": "user1234",
    "password_confirmation": "user1234",
    "role": "user"
}

{
    "name": "nameRedes",
    "email": "redes@email.com",
    "email_confirmation": "redes@email.com",
    "password": "redes1234",
    "password_confirmation": "redes1234",
    "role": "cm"
}

{
    "name": "nameConcejal",
    "email": "concejal@email.com",
    "email_confirmation": "concejal@email.com",
    "password": "concejal1234",
    "password_confirmation": "concejal1234",
    "role": "concejal"
}

{
    "name": "nameSecretario",
    "email": "secretario@email.com",
    "email_confirmation": "secretario@email.com",
    "password": "secretario1234",
    "password_confirmation": "secretario1234",
    "role": "secretario"
}

{
    "name": "nameAdmin",
    "email": "admin@email.com",
    "email_confirmation": "admin@email.com",
    "password": "admin1234",
    "password_confirmation": "admin1234",
    "role": "admin"
}

# ENDPOINTS

## Normativas Endpoints

**permission** -> ver normativa | **method** -> get | **URL** -> regulations/{id} | **Lo que hace** -> show

**permission** -> crear normativa | **method** -> post | **URL** -> regulations | **Lo que hace** -> store

## Admin Endpoints

**permission** -> ver usuarios | **method** -> get | **URL** -> users/non-admin | **Lo que hace** -> getNonAdminUsers

**permission** -> modificar roles de usuarios | **method** -> patch | **URL** -> users/{user}/role | **Lo que hace** -> changeUserRole

**permission** -> ver todos los roles | **method** -> get | **URL** -> roles | **Lo que hace** -> getAllRoles

## CM Endpoints

**role** -> cm

    **method** -> get | **URL** -> news-banners | **Lo que hace** -> getAllNewsAndBanners

    **method** -> get | **URL** -> banners | **Lo que hace** -> getAllBanners

    **method** -> get | **URL** -> news | **Lo que hace** -> getAllNews

    **method** -> get | **URL** -> news-banners/{id} | **Lo que hace** -> show

    **method** -> post | **URL** -> news-banners | **Lo que hace** -> store

    **method** -> patch | **URL** -> news-banners/{id} | **Lo que hace** -> update

    **method** -> delete | **URL** -> news-banners/{id} | **Lo que hace** -> delete


## Sin Logear Endpoints

**method** -> get | **URL** -> banners/published | **Lo que hace** -> getAllPublishedBanners

**method** -> get | **URL** -> news/published | **Lo que hace** -> getAllPublishedNews
