
# Proyecto Protectora 🐾

Aplicación web completa para la gestión de protectoras de animales, desarrollada con Angular en el frontend y Node.js/Express en el backend, con base de datos MongoDB. El proyecto está desplegado en Vercel.

---

## 🔗 Enlaces

- **Frontend (Angular)**: [https://protectora-orcin.vercel.app/portada](https://protectora-orcin.vercel.app/portada)  
- **Backend (Node.js / API)**: [https://servidor-protectora-bice.vercel.app](https://servidor-protectora-bice.vercel.app)  
- **Repositorio GitHub**: [https://github.com/BryanDZV/Protectora](https://github.com/BryanDZV/Protectora)

---

## ⚙️ Tecnologías utilizadas

**Frontend**: Angular 17, HTML, CSS, SCSS, JavaScript, BEM, Grid  
**Backend**: Node.js, Express, MongoDB Atlas  
**Herramientas**: Git/GitHub, Visual Studio Code, Vercel  
**Otros**: npm, Nodemon (desarrollo local)

---

## 🚀 Funcionalidades principales

- Registro y login de usuarios  
- Gestión de mascotas y adopciones  
- Administración de protectora (alta, baja, actualización de datos)  
- Integración completa con MongoDB Atlas  
- Despliegue en Vercel (frontend y backend separados)

---

## 🛠️ Instalación y desarrollo local

1. Clonar repositorio:  
```bash
git clone https://github.com/BryanDZV/Protectora.git
cd Protectora
````

2. Instalar dependencias del frontend:

bash
npm install


3. Instalar dependencias en el server backend:

bash
npm install


4. Configurar variables de entorno (MongoDB URI, puerto, etc.)

5. Ejecutar servidor backend:

bash
npm run dev


6. Ejecutar frontend Angular:

bash

ng serve


7. Abrir navegador en [http://localhost:4200](http://localhost:4200)o puerto que tengas activo para probar la aplicación localmente

---

## 📦 Despliegue en Vercel

* **Frontend**: desplegado en Vercel automáticamente .
* **Backend/API**: desplegado en Vercel como funciones serverless.
* No es necesario subir la carpeta `dist/` al repositorio, Vercel la genera automáticamente.

---

## 📝 Notas adicionales

- Autenticación con JWT ya implementada, en fase de pruebas.
- Validaciones y feedback de formularios en desarrollo.
- Para producción, asegurarse que `environment.prod.ts` tenga `production: true`.
- Cualquier cambio en variables de entorno o MongoDB requiere redeploy.

---

## 📌 Autor

**Bryan Zavala**
Desarrollador en formación – DAW 2º curso
GitHub: [https://github.com/BryanDZV](https://github.com/BryanDZV)
Correo: [bryan.dweb@gmail.com](bryan.dweb@gmail.com)

