<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // 'paths' => ['api/*', 'sanctum/csrf-cookie'],  // Asegúrate de incluir todos los endpoints necesarios
    // 'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    // 'allowed_origins' => ['*'], // Permite el origen de tu frontend
    // 'allowed_headers' => ['*'],  // Permite todos los encabezados
    // 'exposed_headers' => [],
    // 'max_age' => 0,
    // 'supports_credentials' => true,

    'paths' => ['*'],  // Asegúrate de incluir todos los endpoints necesarios
    'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    'allowed_origins' => ['https://concejoarroyoseco.duckdns.org', 'https://4rkgr627-5173.brs.devtunnels.ms'], // Permite el origen de tu frontend
    'allowed_headers' => ['*'],  // Permite todos los encabezados
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,

];
