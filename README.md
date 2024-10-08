# TeamProyectoFinal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

<!-- SIEMPRE HACER  NPM I BACKEND AND FRONTEND
Prueba Tu Aplicación

Abre un navegador web y navega a http://localhost:8080 para verificar que tu aplicación se carga correctamente y que todas las funcionalidades localmente

al desplegar en heroku 
"start": "npx http-server dist/protectora -p $PORT",

al probar localmente pones un valor al port
"start": "npx http-server dist/protectora -p 8080",
ng serve


¿Qué hacer con la carpeta dist?
Mantén dist en el .gitignore de tu proyecto Angular. De esta manera, la carpeta no se sube a Git.
No necesitas la carpeta dist en Git porque Vercel generará automáticamente esa carpeta durante el proceso de despliegue.



PARA VERCELER 
"start": "npx http-server dist/protectora -p $PORT"
sto es correcto si estás sirviendo la aplicación desde la carpeta dist/protectora, pero para Vercel no necesitas un servidor manual como http-server. Vercel usa su propio mecanismo para servir la aplicación.
Puedes eliminar este script si solo lo usas para producción en Vercel, o mantenerlo si lo necesitas localmente.

Dependencias del servidor (http-server, nodemon):
"build": "ng build"
http-server y nodemon no son necesarias para el despliegue en Vercel, ya que Vercel maneja esto automáticamente. Si solo las usas localmente, puedes moverlas a devDependencies o eliminarlas si no las necesitas.

Sugerencias para ajustar el package.json:

Eliminar http-server si solo lo usas para producción en Vercel. Si necesitas usarlo para desarrollo local, puedes mantenerlo.

Asegurarte de que el build optimizado esté bien configurado para producción en Vercel.
 "build": "ng build --prod"

Mover dependencias que solo se usen para desarrollo (como nodemon) a devDependencies.


¿Qué hace production: true?
 deberías poner el production en true en el archivo environment cuando hagas el despliegue en Vercel o en cualquier entorno de producción. Esto afecta cómo Angular optimiza y maneja la aplicación.
