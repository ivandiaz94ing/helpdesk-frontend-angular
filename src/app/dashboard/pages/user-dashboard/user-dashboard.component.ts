import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';
import {
  Equipo,
  Ticket,
  TicketCategory,
  TicketPriority,
} from '../../interfaces/ticket.interface';
import { EquipoService } from '../../services/equipo.service';

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent implements OnInit {
  public ticketService = inject(TicketService);
  public authService = inject(AuthService);
  public equipoService = inject(EquipoService);

  public readonly TicketCategory = TicketCategory;
  public readonly TicketPriority = TicketPriority;

  public user = computed(() => this.authService.user());
  public userRole = computed(() => this.authService.user()?.role);

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
    this.ticketService
      .getTickets()
      .subscribe((tickets) => this.misTickets.set(tickets));

    this.equipoService
      .getEquipos()
      .subscribe((equipos) => this.misEquipos.set(equipos));
  }

  crearTicket(
    titulo: string,
    descripcion: string,
    equipoId: string,
    category: string,
    priority: string,
  ) {
    // 1. Pequeña validación Frontend
    if (
      !titulo.trim() ||
      !descripcion.trim() ||
      !equipoId ||
      !category ||
      !priority
    ) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    // 2. Enviamos el formato exacto que NestJS exige ahora
    this.ticketService
      .crearTicket({
        title: titulo,
        description: descripcion,
        category: category as TicketCategory,
        priority: priority as TicketPriority,
        equipoId: equipoId,
      })
      .subscribe((exito) => {
        if (exito) {
          this.cargarDatos();
        } else {
          alert('Ocurrió un error creando el ticket');
        }
      });
  }

  onLogout() {
    this.authService.logout();
  }

  tomarTicket(ticketId: string) {
    const miId = this.user()?.id;

    if (!miId) return;

    // Llamamos al servicio para asignarnos el ticket
    this.ticketService
      .editarTicket(ticketId, { tecnicoId: miId })
      .subscribe((exito) => {
        if (exito) {
          this.cargarDatos();
        } else {
          alert('Ocurrio un error al intentar tomar el ticket.');
        }
      });
  }
}
