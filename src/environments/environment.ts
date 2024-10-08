export const environment = {
  production: false, //Me permitirá ejecutar tu aplicación localmente, pero comunicarte con la API en Heroku.
  apiUrl: 'https://servidor-protectora-bice.vercel.app', // URL de tu servidor local O SI UIEQERES PUEDES PONER LA WEB
};

//LOCAL EVIROMENT CUANDO LO QUIERAS USAR EN LOCAL PONES TRUE

/*production: false: La aplicación se compila con herramientas de desarrollo.
puedes hacer solicitudes a una API de desarrollo y obtener información detallada sobre errores, lo que facilita la depuración. Por ejemplo, podrías hacer una solicitud a http://localhost:5000/api y
ver exactamente lo que está pasando si algo sale mal.

production: true: La aplicación se compila en modo de producción, lo que significa que se eliminan las advertencias y se aplican
optimizacioneses recomendable hacer solicitudes a tu API de producción (https://servidor-protectora-bice.vercel.app). Las optimizaciones realizadas en este modo garantizarán que tu aplicación sea más rápida y segura, pero tendrás que asegurarte de que el código de la
API esté funcionando correctamente antes de lanzar.
*/
