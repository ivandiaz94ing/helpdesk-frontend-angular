import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  public ticketService = inject(TicketService);

  // Computed para obtener el usuario activo de forma reactiva
  public user = computed(() => this.authService.user());
  public userRole = computed(() => this.user()?.role);

  // Obtenemos las iniciales del usuario (ej: 'ED') para el avatar
  public userInitials = computed(() => {
     const name = this.user()?.fullname || 'AD';
     return name.substring(0, 2).toUpperCase();
  });

  onLogout() {
    this.authService.logout();
  }
}
