import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Obtengo el usuario actual desde el servicio de autenticación
  public user = computed(() => this.authService.user());

  // Variables para el formulario de contraseña
  public currentPassword = '';
  public newPassword = '';
  public confirmPassword = '';

  cambiarContrasena() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (this.newPassword.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Aquí llamaremos al backend más adelante
    this.authService.cambiarPassword(this.currentPassword, this.newPassword).subscribe({
      next: (resp) => {
        alert('¡Constraseña actualizada con éxito');
        // Limpiamos los campos
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        //Captura los errores que envia el backend
        const mensajeError = err.error?.message || 'Error al cambiar la contraseña.';

        // Si es un arreglo (los errores de Regex), los mostramos juntos
        if (Array.isArray(mensajeError)) {
          alert(mensajeError.join('\n'));
        } else {
          alert(mensajeError);
        }
      }
  });
}

  volver() {
    const userRole = this.user()?.role;
    console.log({ userRole });

    // Si es Admin o Técnico, lo mandamos a la tabla de tickets
    if (userRole === 'admin' || userRole === 'agent') {
      this.router.navigateByUrl('/dashboard/app-admin-dashboard/tickets');
    } else {
      // Si es Usuario, lo mandamos a sus tarjetas
      this.router.navigateByUrl('/dashboard/app-user-dashboard');
    }
  }
}
