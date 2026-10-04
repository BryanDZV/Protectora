# Protectora — Frontend (Angular 21)

Aplicación web para explorar animales en adopción, ver sus fichas y enviar
solicitudes. Es el **frontend**; consume una API propia (**BFF**) desplegada por
separado, que a su vez obtiene los animales de RescueGroups y guarda usuarios y
formularios en MongoDB.

- Demo: [protectora-orcin.vercel.app](https://protectora-orcin.vercel.app)
- API de producción: `https://servidor-protectora-bice.vercel.app`
- API local: `http://localhost:5002`

## Stack

- **Angular 21** (componentes standalone, signals, router con lazy loading)
- **TypeScript 5.9** (modo `strict` + plantillas estrictas)
- **Angular Material** + SCSS
- **ngx-translate** para internacionalización (**ES/EN**)
- **HttpClient + RxJS** con un **interceptor de credenciales** (`withCredentials`)
- **Jasmine + Karma** para pruebas

## Funcionalidades

### Públicas
- Portada y onboarding (3 slides).
- Registro e inicio de sesión.
- Galería de animales con búsqueda y filtros (especie, género, tamaño, edad).
- Ficha individual de cada animal.
- Mapa de la protectora.

### Privadas (requieren sesión)
- Inicio con **destacados aleatorios** en cada visita.
- **Favoritos** persistidos en el backend.
- Formulario de solicitud de adopción.
- Consulta de solicitudes (mis solicitudes).
- Perfil y opciones de usuario.
- Cierre de sesión real (borra la cookie en el backend).

## Arquitectura

SPA: el navegador carga Angular y el router cambia las vistas sin recargar.

- Los componentes delegan el HTTP en servicios (`ApiService`, `AuthServiceService`).
- La sesión se guarda en una **cookie `httpOnly`** (no hay token en `localStorage`).
- Un **interceptor** (`credentials.interceptor.ts`) añade `withCredentials: true`
  a todas las peticiones para que la cookie viaje al backend.
- El idioma se cambia en caliente con `LanguageService` (ngx-translate) y se guarda
  en `localStorage` (`app-lang`).

```
Componente → Servicio → (interceptor de credenciales) → API BFF → RescueGroups / MongoDB
```

## Cómo está organizado

```
src/
  app/
    components/nav-bar/     Barra de navegación + selector de idioma
    guards/                 authGuard (protege /home)
    interceptors/           credentials.interceptor (withCredentials)
    services/               api.service, auth.service.service, language.service
    pages/                  galeria, detalle, adopción, favoritos, solicitudes, perfil, opciones, mapa, user
    home/                   layout y home (destacados)
    login/ register/        autenticación
    portada/ slides/        onboarding
    tipos (types/)          Animal, User, AdoptionForm, ...
    app.routes.ts           rutas
    app.config.ts           providers (router, HttpClient + interceptor, ngx-translate)
  assets/i18n/              es.json / en.json
  environments/            environment.ts (dev) / environment.prod.ts (prod)
  styles.scss               estilos globales (incl. imágenes y skeleton)
```

## Rutas principales

| Ruta | Acceso | Vista |
| --- | --- | --- |
| `/portada` | Público | Portada |
| `/slide/:id` | Público | Onboarding |
| `/login` | Público | Login |
| `/register` | Público | Registro |
| `/home` | Sesión | Inicio (destacados) |
| `/home/galeria` | Sesión | Galería |
| `/home/galeria/:id` | Sesión | Detalle del animal |
| `/home/adopcion/:id` | Sesión | Formulario de adopción |
| `/home/mis-solicitudes` | Sesión | Mis solicitudes |
| `/home/favoritos` | Sesión | Favoritos |
| `/home/profile` · `/home/opciones` · `/home/user` · `/home/map` | Sesión | Perfil, opciones, datos, mapa |

La ruta comodín `**` redirige a `/portada`.

## Contrato con el backend (BFF)

El frontend no llama a RescueGroups: todo pasa por el backend.

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/animales?page=&limit=&especie=&genero=&size=&rangoEdad=&texto=` | Galería (paginada + filtros) |
| `GET` | `/animales/:id` | Detalle del animal |
| `POST` | `/user/register` | Registro (abre sesión) |
| `POST` | `/user/login` | Login (establece la cookie `jwt`) |
| `POST` | `/user/logout` | Cerrar sesión |
| `POST` | `/user/checksession` | Restaurar la sesión al arrancar |
| `POST` | `/user/addfav` | Guardar/quitar favoritos (`favPets`) |
| `GET` | `/form` | Listar los formularios del usuario |
| `POST` | `/form` | Crear un formulario (`animalExternalId`) |

> La respuesta de `GET /animales` es `{ data, pagination }` y cada animal ya viene
> normalizado (`id`, `nombre`, `foto`, `imagenes`, `isFavorite`, `localAdoptionStatus`...).

## Internacionalización (ES/EN)

- `src/assets/i18n/es.json` y `en.json` (claves por pantalla).
- Botón **ES/EN** en la barra de navegación.
- Traducción en plantillas con el pipe `{{ 'CLAVE' | translate }}` y en el código
  con `TranslateService`.
- El resumen del animal y los mensajes que envía el backend se muestran en su
  idioma original (son contenido dinámico, no textos de la UI).

## Variables de entorno

Angular no usa `.env`; usa los archivos de entorno:

```ts
// src/environments/environment.ts (dev)
export const environment = { production: false, apiUrl: 'http://localhost:5002' };

// src/environments/environment.prod.ts (prod)
export const environment = { production: true, apiUrl: 'https://servidor-protectora-bice.vercel.app' };
```

No se incluyen secretos: la **API key de RescueGroups vive solo en el backend**.

## Cómo arrancarlo

Requisitos: **Node.js 24.x** y el **backend** en marcha (local en `http://localhost:5002`).

```bash
git clone https://github.com/BryanDZV/Protectora.git
cd Protectora
npm install
npm start
```

La app se sirve en `http://localhost:4200`. El backend debe estar en `http://localhost:5002`
(o cambia `apiUrl` en `environment.ts`).

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | `ng serve` (desarrollo) |
| `npm run build` | `ng build` (producción → `dist/protectora`) |
| `npm test` | Pruebas con Karma |
| `npm run ng -- <cmd>` | Angular CLI directo |

## Decisiones técnicas

- **Sesión por cookie `httpOnly`** en vez de `localStorage`: mitiga XSS.
- **Interceptor de credenciales** para enviar la cookie cross-origin.
- **ngx-translate** para cambio de idioma en caliente.
- **Favoritos en el backend** para no desincronizar entre dispositivos.
- **Paginación en servidor** en la galería + filtrado en cliente como respaldo
  (mientras se usa la API key demo de RescueGroups, que ignora filtros).
- **Skeleton** de carga para mejorar la percepción de velocidad.

## Áreas de mejora

- Sustituir la API key demo de RescueGroups por una real (en el backend) para que
  el filtrado y los datos sean correctos.
- Añadir manejo centralizado de `401`/`403` (sesión caducada) con redirección.
- Incorporar lint/Prettier y un workflow de CI que ejecute `npm test` y `npm run build`.
- Añadir un endpoint en el backend para traer los favoritos en una sola petición
  (hoy se pide cada animal por id).
- Eliminar `convert.js` si deja de ser necesario.

## Autor

**Bryan Zavala**
- GitHub: [BryanDZV](https://github.com/BryanDZV)
