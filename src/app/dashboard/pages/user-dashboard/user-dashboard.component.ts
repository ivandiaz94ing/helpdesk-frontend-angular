import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';
import {TicketCategory} from "../../interfaces/ticket.interface";

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  public ticketService = inject(TicketService);
  public authService = inject(AuthService);

  public user = computed(() => this.authService.user());

  // Obtenemos las iniciales del usuario
  public userInitials = computed(() => {
     const name = this.user()?.fullname || 'NA';
     return name.substring(0, 2).toUpperCase();
  });

  crearTicket(titulo: string, descripcion: string, equipoId: string) {
    if (!titulo.trim() || !descripcion.trim() || !equipoId) return;
    // Actualizamos la función para recibir más datos del formulario

    // Aquí aplicamos tu regla de oro: ¡Un solo objeto como argumento! Esto hace que sea más fácil de mantener y extender en el futuro.
    this.ticketService.createTicket({
      titulo: titulo,
      descripcion: descripcion,
      equipoId: equipoId,
      categoria: TicketCategory.OTROS, // Por defecto, puedes cambiar esto según tu lógica
      usuarioActual: {
        id: this.user()?.id || '',
        email: this.user()?.email || '',
        fullname: this.user()?.fullname || ''
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
