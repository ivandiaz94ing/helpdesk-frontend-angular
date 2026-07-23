import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-dashboard',
  imports: [],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  //1. "Enchufamos" nuestro componente con el servicio
  public ticketService = inject(TicketService);
  authService = inject(AuthService);
  router = inject(Router);

  // constructor() {
  //    // El effect estará observando constantemente los cambios en authStatus()
  //   effect(() => {
  //     // Si el estado de autenticación es "not-authenticated", redirige al usuario a la página de login
  //     if (this.authService.autStatus() === 'not-authenticated') {
  //       this.router.navigate(['/auth/login']);
  //     }
  //   });
  // }

  //2. Esta funcion ya no hace el trabajo duro, solo le avisa al servicio
  crearTicket(nuevoProblema: string) {
    if (nuevoProblema.trim() === '') return;

    // Le enviamos el problema al cerebro central
    this.ticketService.crearTicket(nuevoProblema);
  }




    }

