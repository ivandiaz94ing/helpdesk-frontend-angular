import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard
    ]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    canMatch: [
      AuthenticatedGuard
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard/app-user-dashboard',
    pathMatch: 'full'
  },
  {
    path: "**",
    redirectTo: 'auth/login'
  }



];
