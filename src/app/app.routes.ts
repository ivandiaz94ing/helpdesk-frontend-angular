import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // TODO: Guards
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'

  }


];
