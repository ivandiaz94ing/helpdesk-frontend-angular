import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  private router = inject(Router);
  private authService = inject(AuthService);


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
        this.router.navigate(['/dashboard/app-user-dashboard']);
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 1500);

    });
  }
}
