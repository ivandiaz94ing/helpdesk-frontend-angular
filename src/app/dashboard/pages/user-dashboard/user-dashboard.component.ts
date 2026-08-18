import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';
import {Equipo, Ticket, TicketCategory, TicketPriority} from "../../interfaces/ticket.interface";
import { EquipoService } from '../../services/equipo.service';

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent implements OnInit {
  public ticketService = inject(TicketService);
  public authService = inject(AuthService);
  public equipoService = inject(EquipoService);

  public user = computed(() => this.authService.user());

  // Señales locales para guardar los datos de la base de datos
  public misTickets = signal<Ticket[]>([]);
  public misEquipos = signal<Equipo[]>([]);

  // Obtenemos las iniciales del usuario
  public userInitials = computed(() => {
    const name = this.user()?.fullname || 'NA';
    return name.substring(0, 2).toUpperCase();
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.ticketService.getTickets()
      .subscribe(
        (tickets) => this.misTickets.set(tickets)
      );

    this.equipoService.getEquipos()
      .subscribe(
        (equipos) => this.misEquipos.set(equipos)
      );

  }



  crearTicket(titulo: string, descripcion: string, equipoId: string) {
    if (!titulo.trim() || !descripcion.trim() || !equipoId) return;
    this.ticketService.crearTicket({
      titulo: titulo,
      descripcion: descripcion,
      equipoId: equipoId,
      categoria: TicketCategory.FALLA_RED,
      prioridad: TicketPriority.BAJA,
    }).subscribe(exito => {
      if(exito){
        this.cargarDatos();
      } else {
        alert("Error creando ticket");
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }
}
