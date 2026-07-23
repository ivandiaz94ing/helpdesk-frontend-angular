import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // Esperamos la respuesta de tu backend / localStorage
  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

  // 1. IMPRIMIMOS EL RESULTADO AQUÍ PARA DEPURAR
  console.log('Evaluando NotAuthenticatedGuard. ¿Está logueado?:', isAuthenticated);

  if (isAuthenticated) {
    // Si ya está logueado, lo sacamos de esta ruta (ej: del Login) y lo mandamos al dashboard
    router.navigate(['/dashboard/app-user-dashboard']);
    return false;
  }

  // Si no está logueado, lo dejamos entrar a esta ruta (ej: ver el Login)
  return true;
};
