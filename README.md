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

El proyecto esta separado en tres partes independientes, cada una desplegada por separado:

### 1. Frontend (Angular)

Es la parte visual con la que interactua el usuario. Esta construido con Angular 21 y usa lazy loading para cargar solo lo necesario en cada pagina. Esto mejora el rendimiento: la primera carga es rapida y las paginas internas se cargan bajo demanda.

La comunicacion con el backend se hace a traves de servicios inyectables que centralizan todas las llamadas HTTP. Hay un interceptor de autenticacion que añade el token JWT automaticamente en cada peticion protegida.

### 2. Backend propio (Node.js + Express + MongoDB)

Este backend gestiona todo lo que es exclusivo de la aplicacion: usuarios, formularios de adopcion, favoritos y autenticacion. Se conecta a MongoDB Atlas (base de datos en la nube).

Endpoints principales:
- `/user/register` y `/user/login` para autenticacion con JWT
- `/form` para crear y consultar solicitudes de adopcion
- `/user/:id` para obtener datos del perfil

### 3. Proxy para API externa (RescueGroups)

En lugar de inventar animales de ejemplo, la app consume datos reales de **RescueGroups.org**, una base de datos con miles de animales en adopcion de refugios de Estados Unidos.

Para hacer esto de forma segura, cree un proxy serverless (funcion de Vercel) que:
- Recibe la peticion del frontend
- Añade la clave API de RescueGroups del lado del servidor (nunca expuesta al navegador)
- Devuelve los datos al frontend

Esto evita que cualquier persona pueda inspeccionar el codigo y robar la clave API.

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

3. En otra carpeta (el backend), instalar dependencias:

```bash
cd ../servidor_protectora
npm install
```

4. Configurar variables de entorno en el backend (crear archivo `.env`):

```
PORT=5002
DB_URL=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

5. Levantar el backend:

```bash
npm start
```

6. Levantar el proxy local (en otra terminal):

```bash
cd ../Protectora
npm run start:api
```

7. Levantar el frontend Angular:

```bash
npm start
```

La aplicacion estara disponible en `http://localhost:4200`.

---

## Despliegue

El proyecto esta pensado para desplegarse en Vercel:

- El frontend se compila con `ng build` y se sirve como sitio estatico
- La funcion serverless en `api/rescuegroups.js` se despliega automaticamente como endpoint `/api/rescuegroups`
- El backend propio se despliega por separado en otro proyecto de Vercel

Para produccion, asegurate de configurar las variables de entorno en el panel de Vercel y no en el codigo fuente.

---

## Decisiones tecnicas destacadas

### Por que un proxy para la API externa

RescueGroups.org requiere una clave API para acceder a sus datos. Si la incluyera directamente en el frontend Angular, cualquier usuario podria abrir las herramientas de desarrollo del navegador, copiar la clave y usarla para otros fines.

La solucion fue crear un endpoint intermedio (`/api/rescuegroups`) que:
1. Recibe la peticion del frontend sin clave
2. Añade la clave del lado del servidor (donde no es visible)
3. Consulta a RescueGroups y devuelve la respuesta

Asi la clave permanece oculta y el frontend sigue funcionando igual.

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
