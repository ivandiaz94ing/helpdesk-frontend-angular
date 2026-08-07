import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TicketStatus } from '../../interfaces/ticket.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TicketService } from '../../services/ticket.service';

    @Component({
      selector: 'app-ticket-detail',
      standalone: true,
      imports: [CommonModule, RouterLink], // RouterLink es vital para el botón de "Volver"
      templateUrl: './ticket-detail.component.html',
    })
    export class TicketDetailComponent {
      private route = inject(ActivatedRoute);
      public ticketService = inject(TicketService);
      private authService = inject(AuthService);

      // Exponemos el rol públicamente de forma segura
      public userRole = computed(() => this.authService.user()?.role);
      public user = computed(() => this.authService.user());

      // 1. Capturamos el ID que viene en la URL (ej: /ticket/123 -> id: '123')
      public ticketId = this.route.snapshot.paramMap.get('id');

      // 2. Buscamos el ticket en nuestra base de datos simulada
      public ticket = computed(() => {
        return this.ticketService.tickets().find(t => t.id === this.ticketId);
      });

      // 3. Función para que el usuario agregue un comentario al chat
      enviarComentario(mensaje: string) {
        if (!mensaje.trim()) return; // No enviamos mensajes vacíos

        const usuarioLogueado = this.authService.user();
        if (!usuarioLogueado) return;

        // Llamamos a nuestro servicio pasándole el ID del ticket actual, el mensaje y quién lo escribió
        this.ticketService.agregarComentario(this.ticketId!, mensaje, usuarioLogueado);
      }

      // Funcion para tomar el caso
      tomarTicket(){
        const tecnico = this.authService.user();
        if (!tecnico || !this.ticketId) return;
        this.ticketService.asignarTecnico(this.ticketId, tecnico);
      }

      // Funcion para cambiar el estado del ticket
      actualizarEstado(event: Event){
        const selectElement = event.target as HTMLSelectElement;
        const nuevoEstado = selectElement.value as TicketStatus;
        if (!this.ticketId) return;
        this.ticketService.cambiarEstado(this.ticketId, nuevoEstado);
      }
    }
