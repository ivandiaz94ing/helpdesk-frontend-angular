import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../interfaces/ticket.interface';
import { RouterLink } from '@angular/router';
import { ModalConfirmacionComponent } from '../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalConfirmacionComponent, PaginationComponent],
  templateUrl: './admin-tickets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTickets implements OnInit {
  public readonly ticketPriority = TicketPriority;
  public readonly ticketStatus = TicketStatus;
  public ticketAEliminar = signal<string | null>(null);
  // Inyectamos el servicio central donde viven los tickets
  public ticketService = inject(TicketService);

  public totalTickets = signal<number>(0);
  public offsetActual = signal<number>(0);
  public limit = 10;

  public terminoBusqueda = signal('');
  public ticketsOriginales = signal<Ticket[]>([]);

  // Filtro reactivo para buscar por título, nombre de usuario o estado
  public ticketsFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const lista = this.ticketsOriginales();

    if (!termino) return lista;

    return lista.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(termino) ||
        ticket.status.toLowerCase().includes(termino) ||
        ticket.user?.fullname.toLowerCase().includes(termino),
    );
  });

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets() {
    this.ticketService.getTickets(this.limit, this.offsetActual()).subscribe((ticketsBack) => {
      this.ticketsOriginales.set(ticketsBack.data);
      this.totalTickets.set(ticketsBack.meta.total);
    });
  }

  cambiarPagina(nuevoOffset: number) {
  this.offsetActual.set(nuevoOffset); // Actualizamos
  this.cargarTickets(); // Pedimos los nuevos tickets
}

  buscar(texto: string) {
    this.terminoBusqueda.set(texto);
  }

  // Funciones placeholder para los futuros modales
  verDetalles(ticket: Ticket) {
    console.log('Ver detalles del ticket:', ticket);
  }

  prepararCierre(ticket: Ticket) {
    console.log('Cerrar ticket:', ticket);
  }

  // BORRAR TICKET
  // Cuando hacen clic en el basurero
  prepararEliminacion(id: string) {
    this.ticketAEliminar.set(id);
    const modal = document.getElementById(
      'modalEliminarTicket',
    ) as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  // Cuando el modal responde que dijeron "SI"
  borrarTicketConfirmado() {
    const id = this.ticketAEliminar();
    if (!id) return;

    this.ticketService.eliminarTicket(id).subscribe((exito) => {
      if (exito) {
        this.ticketsOriginales.update((current) =>
          current.filter((t) => t.id !== id),
        );
        this.ticketAEliminar.set(null);
      } else {
        alert('Hubo un problema al intentar eliminar el ticket.');
      }
    });
  }
}
