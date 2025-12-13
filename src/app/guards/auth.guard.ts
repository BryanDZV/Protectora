import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../servicios/auth.service.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const user = authService.currentUserSig();

  // ⬇️ Si el usuario está cargando (undefined), permitimos pasar
  if (user === undefined) {
    return true;
  }

  // ⬇️ Si es null → no autenticado
  if (user === null) {
    router.navigate(['/login']);
    return false;
  }

  // ⬇️ Si tiene datos → autenticado
  return true;
};
