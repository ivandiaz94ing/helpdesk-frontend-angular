import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, RouterLink ],
  templateUrl: './login.html',
})
export class Login {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  private router = inject(Router);
  private authService = inject(AuthService);

  // constructor() {
  //   // Si el usuario ya está autenticado, redirigirlo al dashboard
  //   if (this.authService.autStatus() === 'authenticated') {
  //     this.router.navigate(['/dashboard/app-user-dashboard']);
  //   }
  // }


  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 1500);
      return;
    }
    const { email='', password='' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe( (isAuthenticated) => {
      if (isAuthenticated) {
        const usuarioActual = this.authService.user();
        console.log("Datos del usuario:", usuarioActual); // <-- Agrega esto
        if (usuarioActual && usuarioActual.role === 'admin') {
        this.router.navigate(['/dashboard/app-admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard/app-user-dashboard']);
        }
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 1500);

    });
  }
}
