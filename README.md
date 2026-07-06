# Protectora Web App

Aplicacion web completa para gestionar una protectora de animales. Permite a los usuarios registrarse, explorar animales en adopcion, guardar favoritos y enviar solicitudes de adopcion. Incluye un panel de administracion para gestionar los animales, formularios y usuarios.

**Demo en vivo:** [https://protectora-orcin.vercel.app](https://protectora-orcin.vercel.app/portada)

---

## Que hace esta aplicacion

La app resuelve un problema real: conectar protectoras de animales con personas que quieren adoptar. En lugar de tener que llamar o ir fisicamente a la protectora, un usuario puede:

- Ver animales disponibles en adopcion con fotos, descripcion, edad, ubicacion y estado de salud
- Filtrar por especie, tamano, edad o genero
- Guardar animales como favoritos
- Enviar un formulario de adopcion completo (datos personales, vivienda, experiencia previa)
- Registrar una cuenta para guardar sus solicitudes

Para la protectora, la app permite gestionar todos los animales, revisar solicitudes y administrar usuarios desde un mismo lugar.

---

## Arquitectura del proyecto

El proyecto sigue el patron **Backend For Frontend (BFF)**: el frontend Angular solo habla con un unico backend, y este backend se encarga de comunicarse con las APIs externas.

```
Angular App  ──▶  Backend Express  ──▶  MongoDB (usuarios, forms)
                  │
                  └──▶  RescueGroups.org (animales reales)
```

### 1. Frontend (Angular)

Interfaz de usuario construida con Angular 21. Usa lazy loading para cargar paginas bajo demanda, lo que mejora el rendimiento inicial.

La comunicacion con el backend se centraliza en servicios inyectables. Un interceptor añade el token JWT automaticamente en cada peticion protegida.

### 2. Backend (Node.js + Express + MongoDB)

El backend gestiona toda la logica de la aplicacion:

**Datos propios (MongoDB Atlas):**
- `/user/register` y `/user/login` — Autenticacion con JWT
- `/form` — Solicitudes de adopcion
- `/user/:id` — Perfil del usuario

**Proxy para API externa:**
- `/rescuegroups` — Recibe la peticion del frontend, añade la clave API de RescueGroups del lado del servidor, consulta los datos reales de animales en adopcion y devuelve la respuesta al frontend

Esta arquitectura evita exponer la clave API al navegador y permite cachear o filtrar datos antes de enviarlos al cliente.

---

## Tecnologias utilizadas

| Capa | Tecnologia | Para que sirve |
|------|-----------|----------------|
| Frontend | Angular 21 + TypeScript | Interfaz de usuario, routing, signals para estado reactivo |
| Estilos | SCSS + Angular Material | Componentes visuales responsivos y accesibles |
| Backend | Node.js + Express | API REST, autenticacion, logica de negocio |
| Base de datos | MongoDB Atlas | Almacenamiento de usuarios, formularios y favoritos |
| Autenticacion | JWT + bcrypt | Tokens seguros y contrasenas encriptadas |
| Deploy | Vercel | Frontend como sitio estatico, proxy como funcion serverless |
| API externa | RescueGroups.org | Datos reales de animales en adopcion |

---

## Funcionalidades principales

- Registro y login de usuarios con validacion de email y contrasena
- Listado de animales en adopcion con scroll infinito y filtros combinados (especie, edad, tamano, genero)
- Detalle completo de cada animal: fotos, historia, salud, requisitos de adopcion
- Sistema de favoritos persistente en localStorage
- Formulario de adopcion en varios pasos con validacion de campos
- Historial de solicitudes de adopcion del usuario
- Integracion con datos reales de RescueGroups.org via proxy seguro
- Rutas protegidas con guard (solo accesibles si el usuario esta logueado)
- Responsive design: funciona en movil, tablet y escritorio

---

## Instalacion y desarrollo local

### Requisitos previos

- Node.js 20 o superior
- Cuenta en MongoDB Atlas (o base de datos local)
- Clave API de RescueGroups.org (la mia ya esta configurada en el proxy)

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/BryanDZV/Protectora.git
cd Protectora
```

2. Instalar dependencias del frontend:

```bash
npm install
```

3. En otra carpeta, clonar y preparar el backend:

```bash
cd ../servidor_protectora
npm install
```

4. Configurar variables de entorno en el backend (crear archivo `.env`):

```
PORT=5007
DB_URL=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
RESCUEGROUPS_APIKEY=tu_clave_de_rescuegroups
```

5. Levantar el backend:

```bash
npm start
```

6. Levantar el frontend Angular (en otra terminal):

```bash
cd ../Protectora
npm start
```

La aplicacion estara disponible en `http://localhost:4200` y se comunicara automaticamente con el backend en `http://localhost:5007`.

---

## Despliegue

El proyecto se despliega en Vercel en dos partes:

- **Frontend**: `ng build` genera el sitio estatico. Vercel lo sirve automaticamente.
- **Backend**: Desplegado en un proyecto separado de Vercel. Incluye las rutas propias (`/user`, `/form`) y el proxy para RescueGroups (`/rescuegroups`).

Variables de entorno obligatorias en el backend (Vercel):
- `DB_URL` — URI de MongoDB Atlas
- `JWT_SECRET` — Secreto para firmar tokens
- `RESCUEGROUPS_APIKEY` — Clave de RescueGroups.org

---

## Decisiones tecnicas destacadas

### Por que el proxy esta en el backend y no en el frontend

RescueGroups.org requiere una clave API. La regla de oro en seguridad es: **nunca expongas claves API al navegador**. Si la incluyera en el frontend, cualquier usuario podria inspeccionar el codigo, copiar la clave y usarla para otros fines.

La solucion fue añadir el proxy directamente en el backend Express (`POST /rescuegroups`). El frontend solo habla con su propio backend, y este backend es el que consulta a RescueGroups con la clave oculta en una variable de entorno.

Ventajas de esta arquitectura:
- La clave API nunca llega al navegador
- Se puede cachear la respuesta de RescueGroups para reducir peticiones externas
- Se puede filtrar o transformar los datos antes de enviarlos al cliente
- Un unico dominio para todo (menos problemas de CORS)

### Por que lazy loading

La aplicacion tiene muchas paginas (galeria, detalle, formularios, perfil, etc.). Sin lazy loading, el navegador descargaria todo el codigo JavaScript de golpe al entrar, lo que ralentizaria la primera carga. Con lazy loading, cada pagina se descarga solo cuando el usuario navega a ella. Esto mejora el tiempo de carga inicial y el rendimiento general.

---

## Autor

**Bryan Zavala**

Desarrollador web en formacion, actualmente cursando DAW (Desarrollo de Aplicaciones Web).

- GitHub: [github.com/BryanDZV](https://github.com/BryanDZV)
- Email: bryan.dweb@gmail.com

---

## Repositorios relacionados

- **Frontend (este repo):** [github.com/BryanDZV/Protectora](https://github.com/BryanDZV/Protectora)
- **Backend propio:** [github.com/BryanDZV/servidor-protectora](https://github.com/BryanDZV/servidor-protectora) (Node.js + Express + MongoDB)
