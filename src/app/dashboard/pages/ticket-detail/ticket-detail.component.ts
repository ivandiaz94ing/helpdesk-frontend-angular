import { Component, computed, inject, signal } from '@angular/core';
    import { ActivatedRoute, RouterLink } from '@angular/router';
    import { TicketService } from '../../services/ticket.service';
    import { AuthService } from '../../../auth/services/auth.service';
    import { CommonModule } from '@angular/common';

    @Component({
      selector: 'app-ticket-detail',
      standalone: true,
      imports: [CommonModule, RouterLink], // RouterLink es vital para el botón de "Volver"
      templateUrl: './ticket-detail.component.html',
    })
    export class TicketDetailComponent {
      private route = inject(ActivatedRoute);
      public ticketService = inject(TicketService);
      public authService = inject(AuthService);

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
    }         
