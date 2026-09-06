import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, map } from 'rxjs';

import {
  Ticket,
  CreateTicketDTO,
  Comment,
} from '../interfaces/ticket.interface';

const baseUrl =
  'https://helpdesk-backend-api-54750791481.southamerica-east1.run.app/';
 const baseUrlLocal =
   'http://127.0.0.1:3000/';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);

  // 1. OBTENER TODOS LOS TICKETS (GET /ticket)
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${baseUrl}ticket`).pipe(
      catchError((err) => {
        console.error('Error al cargar tickets:', err);
        return of([]);
      }),
    );
  }

  // 2. CREAR TICKET (POST /ticket)
  crearTicket(datos: CreateTicketDTO, imagenes: File[] = []): Observable<boolean> {
    const formData = new FormData();
    formData.append('title', datos.title);
    formData.append('description', datos.description);
    formData.append('priority', datos.priority);
    formData.append('category', datos.category);
    formData.append('equipoId', datos.equipoId);

    // Empaquetamos las imagenes
    imagenes.forEach(imagen => {
      formData.append('images', imagen);
    });

    return this.http.post<Ticket>(`${baseUrl}ticket`, formData).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Error al crear ticket:', err);
        return of(false);
      }),
    );
  }

  // 3. EDITAR / ACTUALIZAR TICKET (PATCH /ticket/:id)
  editarTicket(
    id: string,
    datos: Partial<CreateTicketDTO | { status: string; tecnicoId: string }>,
  ): Observable<boolean> {
    return this.http.patch(`${baseUrl}ticket/${id}`, datos).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Error al editar ticket:', err);
        return of(false);
      }),
    );
  }

  // 4. ELIMINAR TICKET (DELETE /ticket/:id)
  eliminarTicket(id: string): Observable<boolean> {
    return this.http.delete(`${baseUrl}ticket/${id}`).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Error al eliminar ticket:', err);
        return of(false);
      }),
    );
  }

  // Agrega esto dentro de tu clase TicketService
  agregarComentario(ticketId: string, message: string): Observable<Comment> {
    return this.http.post<Comment>(`${baseUrl}comments/${ticketId}`, {
      message,
    });
  }
}
