# Proyecto de Digitalización de Normativas y Gestión de Banners y Noticias

Este proyecto es un sistema integral para la **gestión de regulaciones municipales**, **noticias** y **banners**. Está compuesto por un **backend en Laravel** y un **frontend en React**, que permite la creación, modificación y aprobación de normativas, así como la gestión de contenido multimedia. El sistema incluye autenticación, control de roles y permisos, y digitalización de normativas.

## Características

### Gestión de Normativas

- **Tipos de normativas**:
  - **Ordenanzas**: Creación y gestión de normativas legislativas. Solo DEM y concejales pueden ser autores.
  - **Correspondencia**: Gestión de comunicaciones oficiales. Solo DEM puede ser autor.
  - **Minutas, Declaraciones, Resoluciones y Decretos**: Normativas creadas solo por concejales, pudiendo tener múltiples autores si son de tipo concejal.
- **Estado de las normativas**: Las normativas pueden estar en estado "en proceso" o "aprobado". Solo Admin y Secretario pueden cambiar el estado.
- **Historial de modificaciones**: Se lleva un registro completo de las modificaciones realizadas en las normativas.
- **Digitalización de normativas**: Permite la gestión digital de documentos normativos.

### Gestión de Noticias y Banners

- **Noticias**: Creación, modificación y gestión de noticias con fechas de publicación y despublicación.
- **Banners**: Administración de banners que se pueden mostrar en diferentes secciones del sistema.
- **Control de publicación**: Los banners y las noticias tienen control sobre su estado de publicación.

### Roles y Permisos

- **Admin**:
  - Puede registrar nuevos usuarios.
  - No tiene control sobre la gestión de noticias y banners.
- **Secretario**:
  - Puede crear todo tipo de normativas, modificarlas y aprobarlas.
  - Tiene control total sobre las regulaciones.
- **Concejal**:
  - Puede crear regulaciones de tipo "Minutas", "Declaraciones", "Resoluciones" y "Decretos".
  - Puede ser autor de regulaciones de estos tipos, con la posibilidad de tener múltiples autores si son de tipo concejal.
- **CM** (Community Manager):
  - Puede gestionar las noticias y banners.
- **User**:
  - Rol asignado a los usuarios retirados del cargo o sin permisos administrativos.

### Autenticación y Seguridad

- **Laravel Breeze**: Se utiliza para la autenticación de usuarios en el backend, con registro, inicio de sesión y cambio de contraseñas.
- **Laravel Sanctum**: Para la gestión de tokens y autorización de acceso a las rutas protegidas.
- **Spatie Laravel Permissions**: Para la gestión avanzada de roles y permisos en el sistema.

## Tecnologías Utilizadas

- **Backend**:
  - **Laravel 10**: Framework PHP para el backend y manejo de la API.
  - **Sanctum**: Para la autenticación de API.
  - **Breeze**: Para la autenticación de usuarios.
  - **Spatie Laravel Permissions**: Para gestionar roles y permisos.
- **Frontend**:
  - **React**: Framework JavaScript para la interfaz de usuario.
  - **Axios**: Para hacer las peticiones HTTP desde React hacia el backend.
  - **Bootstrap y Tailwind CSS**: Para los estilos del frontend.
- **Base de Datos**:
  - **MySQL**: Sistema de gestión de base de datos.
- **Otras Tecnologías**:
  - **Node.js** y **npm**: Para el manejo de dependencias del frontend.

## Estructura del Proyecto

### Backend (API)

- **Rutas**:
  - `/api/regulations`: Para crear, modificar y listar las normativas.
  - `/api/news_banners`: Para gestionar las noticias y banners.
  - `/api/auth`: Para el inicio de sesión, registro y gestión de usuarios.
  
- **Modelos principales**:
  - **Regulation**: Modelo para las regulaciones, con diferentes tipos y un historial de cambios.
  - **NewsBanner**: Modelo para las noticias y banners.
  - **User**: Modelo para los usuarios con roles y permisos asociados.

### Frontend (React)

- **Páginas principales** (algunas):
  - **Dashboard**: Vista general con acceso a todas las funciones.
  - **Regulations**: Sección para gestionar las normativas (crear, editar, aprobar).
  - **News & Banners**: Sección para gestionar las noticias y banners.
  - **Login**: Página de inicio de sesión para usuarios.
  - **Register**: Página de registro de nuevos usuarios.
  
- **Componentes**:
  - **Navbar**: Barra de navegación que permite el acceso rápido a las secciones.
  - **RegulationForm**: Formulario para crear y editar normativas.
  - **NewsBannerForm**: Formulario para gestionar noticias y banners.

## Instalación

### Backend (API)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/LorenzoCampos/ProyectoConcejo.git
   ```

2. Accede al directorio del proyecto:
   ```bash
   cd ProyectoConcejo/backend-api
   ```

3. Instala las dependencias de PHP:
   ```bash
   composer install
   ```

4. Configura el archivo `.env` con tus credenciales de base de datos:
   ```bash
   cp .env.example .env
   ```

5. Ejecuta las migraciones:
   ```bash
   php artisan migrate
   ```

6. Ejecuta los roles:
   ```bash
   php artisan db:seed 
   ```

6. Ejecuta starage link:
   ```bash
   php artisan storage:link 
   ```

7. Inicia el servidor de desarrollo:
   ```bash
   php artisan serve
   ```

### Frontend (React)

1. Accede al directorio del frontend:
   ```bash
   cd ProyectoConcejo/FrontEnd
   ```

2. Instala las dependencias de JavaScript:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso

### Roles y Permisos

- **Admin**: Puede registrar nuevos usuarios. No tiene control sobre la gestión de noticias y banners.
- **Secretario**: Puede crear, modificar y aprobar todas las normativas.
- **Concejal**: Puede crear regulaciones de tipo "Minutas", "Declaraciones", "Resoluciones" y "Decretos".
- **CM**: Puede gestionar noticias y banners.
- **User**: Rol asignado a los usuarios retirados del cargo.

### Gestión de Normativas

- **Crear regulaciones**: Los usuarios pueden crear diferentes tipos de regulaciones según sus roles.
- **Modificar regulaciones**: Los Admin y Secretarios pueden modificar regulaciones, mientras que los concejales solo pueden modificar las suyas.
- **Aprobar regulaciones**: Los Admin y Secretarios pueden aprobar las regulaciones.

### Noticias y Banners

- **Gestionar noticias y banners**: Los CM pueden crear y gestionar noticias y banners.
- **Control de publicación**: Las noticias y banners tienen un control de publicación y despublicación.

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo `LICENSE`.