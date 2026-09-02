import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket.interface';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  public ticketService = inject(TicketService);

  public user = computed(() => this.authService.user());
  public userRole = computed(() => this.user()?.role);

  public userInitials = computed(() => {
    const name = this.user()?.fullname || 'AD';
    return name.substring(0, 2).toUpperCase();
  });

  // --- LÓGICA DE ESTADÍSTICAS REALES ---
  public misTickets = signal<Ticket[]>([]);

  // Calculamos los pendientes
  public ticketsPendientes = computed(() => {
    return this.misTickets().filter(
      (t) => t.status === 'abierto' || t.status === 'en proceso',
    ).length;
  });

  // Calculamos los resueltos
  public ticketsResueltos = computed(() => {
    return this.misTickets().filter((t) => t.status === 'cerrado').length;
  });

  ngOnInit() {
    // Al iniciar, pedimos los tickets reales
    this.ticketService.getTickets().subscribe((tickets) => {
      this.misTickets.set(tickets);
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
