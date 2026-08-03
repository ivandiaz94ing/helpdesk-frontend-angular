import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent { 
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  public registerForm: FormGroup = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 1500);
      return;
    }
    
    const { fullname='', email='', password='' } = this.registerForm.value;

    this.isPosting.set(true);
    this.authService.register(fullname, email, password).subscribe((isAuthenticated) => {
      this.isPosting.set(false);
      if (isAuthenticated) {
        this.router.navigate(['/dashboard/app-user-dashboard']);
        return;
      }

      // Si falla, mostramos el error
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 1500);
    });
  }
}
