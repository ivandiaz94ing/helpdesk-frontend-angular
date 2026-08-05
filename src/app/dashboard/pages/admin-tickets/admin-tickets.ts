import { CommonModule } from '@angular/common';
 import { TicketService } from '../../services/ticket.service';
import {ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTickets {
  // Inyectamos el servicio central donde viven los tickets
  public ticketService = inject(TicketService);

}
