import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../../interfaces/ticket.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { RelativeDatePipe } from '../../pipes/relative-date.pipe';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RelativeDatePipe],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public ticketService = inject(TicketService);
  private authService = inject(AuthService);

  public userRole = computed(() => this.authService.user()?.role);
  public user = computed(() => this.authService.user());

  public ticketId = this.route.snapshot.paramMap.get('id');
  public readonly TicketPriority = TicketPriority;
  public readonly TicketStatus = TicketStatus;
  public mensajeExito = signal<string | null>(null);
  // Nueva señal para la lista de técnicos disponibles
  public agentes = signal<any[]>([]);

  // Lo convertimos en un Signal normal
  public ticket = signal<Ticket | null>(null);

  volver() {
    // Si eres administrador, te devuelve a tu tabla
    if (this.userRole() === 'admin') {
      this.router.navigate(['/dashboard/app-admin-dashboard/tickets']);
    } else {
      // Si eres usuario normal, te devuelve a la tuya
      this.router.navigate(['/dashboard/app-user-dashboard']);
    }
  }

  ngOnInit() {
    if (this.ticketId) {
      // Temporalmente traemos todos y filtramos, hasta que en NestJS crees el GET/ticket/:id
      this.ticketService.getTickets().subscribe((tickets) => {
        const t = tickets.find((x) => x.id === this.ticketId);
        if (t) this.ticket.set(t);
      });
    }

    // NUEVO: Si es Admin, traemos a los agentes para el selector
    if (this.userRole() === 'admin') {
      this.authService.getUsers().subscribe((usuarios) => {
        // Asumiendo que el rol del técnico en tu BD se guarda como 'agent'.
        // Si se guarda en mayúscula 'AGENT', cámbialo aquí.
        const soloTecnicos = usuarios.filter((u) => u.role === 'agent');
        this.agentes.set(soloTecnicos);
      });
    }
  }

  enviarComentario(mensaje: string, inputElement: HTMLInputElement) {
    if (!mensaje.trim() || !this.ticketId) return;

    this.ticketService
      .agregarComentario(this.ticketId, mensaje)
      .subscribe((nuevoComentario) => {
        // Magia Reactiva: Actualizamos el array de comentarios instantáneamente
        this.ticket.update((t) => {
          if (!t) return t;
          // Si ya tenía comentarios le sumamos este, si no, creamos el array
          const comentariosActuales = t.comments || [];
          return { ...t, comments: [...comentariosActuales, nuevoComentario] };
        });

        // Limpiamos la caja de texto
        inputElement.value = '';
      });
  }

  asignarTecnico(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoTecnicoId = selectElement.value;

    if (!this.ticketId || !nuevoTecnicoId) return;

    this.ticketService
      .editarTicket(this.ticketId, { tecnicoId: nuevoTecnicoId })
      .subscribe((exito) => {
        if (exito) {
          // Actualizamos la UI al instante encontrando el nombre del técnico
          const tecnicoElegido = this.agentes().find(
            (a) => a.id === nuevoTecnicoId,
          );
          if (tecnicoElegido) {
            this.ticket.update((t) =>
              t ? { ...t, tecnico: tecnicoElegido } : t,
            );
          }

          this.mensajeExito.set(
            'El ticket fue asignado al técnico exitosamente',
          );
          setTimeout(() => this.mensajeExito.set(null), 3000);
        }
      });
  }

  actualizarEstado(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value as TicketStatus;
    if (!this.ticketId) return;

    // Aquí sí usamos la función real que hicimos hace un rato
    this.ticketService
      .editarTicket(this.ticketId, { status: nuevoEstado })
      .subscribe((exito) => {
        if (exito) {
          // 1. Magia Reactiva: Actualizamos el ticket local sin hacer F5
          this.ticket.update((t) => (t ? { ...t, status: nuevoEstado } : t));

          // 2. Mostramos la notificación elegante
          this.mensajeExito.set(
            'El estado del ticket se actualizó correctamente',
          );

          // 3. Escondemos la notificación después de 3 segundos (3000 ms)
          setTimeout(() => {
            this.mensajeExito.set(null);
          }, 1000);
        }
      });
  }
}
