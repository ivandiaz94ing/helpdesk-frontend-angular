import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor() { }
   tickets = signal([
    { id: 1, issue: 'Fallo de red en la comandancia', status: 'Abierto' },
    { id: 2, issue: 'Impresora sin tóner', status: 'En progreso' },
    { id: 3, issue: 'Actualización de antivirus', status: 'Cerrado' }
  ]);
   // NUEVA FUNCIÓN: Recibe el texto que el usuario escribió
      crearTicket(nuevoProblema: string) {
        // Si el usuario no escribió nada, ignoramos la acción
        if (nuevoProblema.trim() === '') return;

        // Usamos .update() para actualizar la lista de nuestro Signal en tiempo real
        this.tickets.update(listaActual => {

          // Creamos un nuevo objeto ticket
          const nuevoTicket = {
            id: listaActual.length + 1, // Le asignamos el siguiente número (ej. 4)
            issue: nuevoProblema,       // El texto que escribió el usuario
            status: 'Abierto'           // Todo ticket nuevo nace abierto
          };

          // Devolvemos la lista vieja pero agregándole el ticket nuevo al principio
          return [nuevoTicket, ...listaActual];
        });
      }

    }


