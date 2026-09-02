import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { Login } from './pages/login/login';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      // {
      //   path: 'forgot-password',
      //   component: ForgotPasswordComponent
      // }
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
