import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // Esperamos la respuesta de tu backend / estado
  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());


  if (!isAuthenticated) {
    // Si no está logueado lo mandamos al login
    router.navigate(['/auth/login']);
    return false;
  }

  // Si SI está logueado, lo dejamos pasar al dashboard)
  return true;
};
