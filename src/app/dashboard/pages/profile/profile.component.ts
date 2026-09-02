import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
    console.log('Datos listos para enviar al backend:', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });

    alert('¡Validación exitosa! Falta conectar con NestJS.');
  }

  volver(){
    const userRole = this.user()?.role;
    console.log({userRole});

    // Si es Admin o Técnico, lo mandamos a la tabla de tickets
    if (userRole === 'admin' || userRole === 'agent') {
      this.router.navigateByUrl('/dashboard/app-admin-dashboard/tickets');
    } else {
      // Si es Usuario, lo mandamos a sus tarjetas
      this.router.navigateByUrl('/dashboard/app-user-dashboard');
    }
  }
}
