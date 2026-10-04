import { HttpInterceptorFn } from '@angular/common/http';

// Angular no tiene un `withCredentials` global: lo aplicamos aquí para que la
// cookie httpOnly de sesión viaje en TODAS las peticiones al backend.
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
