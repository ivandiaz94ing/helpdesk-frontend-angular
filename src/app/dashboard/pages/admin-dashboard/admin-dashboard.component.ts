import {
  ChangeDetectionStrategy, Component, computed, inject,
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
export class AdminDashboardComponent {
  private authService = inject(AuthService);

  public user = computed(() => this.authService.user());
  public userRole = computed(() => this.user()?.role);

  public userInitials = computed(() => {
    const name = this.user()?.fullname || 'AD';
    return name.substring(0, 2).toUpperCase();
  });

  onLogout() {
    this.authService.logout();
  }
}
