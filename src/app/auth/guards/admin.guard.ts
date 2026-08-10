import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //1. Verificar si el usuario está logeado
  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  //2. Verificar si el usuario tiene el rol de admin
  const user = authService.user();
  if (user && user.role !== 'admin') {
    router.navigate(['/dashboard/app-user-dashboard']);
    return false;
  }
  // Si pasa las dos pruebas, bienvenido señor Administrador
  return true;

};
