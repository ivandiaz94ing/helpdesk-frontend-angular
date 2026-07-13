import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'user-dashboard',
  imports: [],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  //1. "Enchufamos" nuestro componente con el servicio
  public ticketService = inject(TicketService);

  //2. Esta funcion ya no hace el trabajo duro, solo le avisa al servicio
  crearTicket(nuevoProblema: string) {
    if (nuevoProblema.trim() === '') return;

    // Le enviamos el problema al cerebro central
    this.ticketService.crearTicket(nuevoProblema);
  }




    }

