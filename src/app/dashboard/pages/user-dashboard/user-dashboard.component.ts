import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';

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
     const name = this.user()?.fullname || 'US';
     return name.substring(0, 2).toUpperCase();
  });

  crearTicket(nuevoProblema: string) {
    if (nuevoProblema.trim() === '') return;
    this.ticketService.crearTicket(nuevoProblema);
  }

  onLogout() {
    this.authService.logout();
  }
}
