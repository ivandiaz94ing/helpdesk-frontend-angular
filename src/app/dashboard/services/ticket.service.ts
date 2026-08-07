import { computed, Injectable, signal } from '@angular/core';
import { Ticket, TicketStatus, TicketCategory, Equipo, UserBasic, TicketCreateDTO, TicketPriority } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
   // 1. Equipos simulados que pertenecen al usuario (esto luego vendrá del backend)
   equipos = signal<Equipo[]>([
    { id: 'eq-1', nombre: 'Laptop Dell', marca: 'Dell', modelo: 'XPS 13', numeroSerie: '12345', isActive: true },
    { id: 'eq-2', nombre: 'Impresora HP', marca: 'HP', modelo: 'LaserJet Pro', numeroSerie: '67890', isActive: true },
    { id: 'eq-3', nombre: 'Router TP-Link', marca: 'TP-Link', modelo: 'Archer C7', numeroSerie: '54321', isActive: false }
  ]);
  // 2. Tickets simulados (esto luego vendrá del backend)
  tickets = signal<Ticket[]>([]);

  constructor() { }
  //  tickets = signal([
  //   { id: 1, issue: 'Fallo de red en la comandancia', status: 'Abierto' },
  //   { id: 2, issue: 'Impresora sin tóner', status: 'En progreso' },
  //   { id: 3, issue: 'Actualización de antivirus', status: 'Cerrado' }
  // ]);
  //Estadisticas para el administrador
  ticketsPendientes = computed(() => {
    return this.tickets().filter(t => t.status === 'abierto' || t.status === 'en_progreso').length;
  });
  ticketsResueltos = computed(() => {
    return this.tickets().filter(t => t.status === 'cerrado').length;
  });

   // 3 NUEVA FUNCIÓN CREAR TICKET
   createTicket(ticketData: TicketCreateDTO) {

    // Buscamos el equipo por su ID
    const equipoSeleccionado = this.equipos().find(eq => eq.id === ticketData.equipoId);
    if (!equipoSeleccionado) return; // Si no se encuentra el equipo, no hacemos nada

    // Creamos un nuevo ticket
    const nuevoTicket: Ticket = {
      id: crypto.randomUUID(), // Generamos un ID único
      title: ticketData.titulo,
      description: ticketData.descripcion,
      priority: TicketPriority.BAJA, // Por defecto, puedes cambiar esto según tu lógica
      categoria: ticketData.categoria,
      status: TicketStatus.ABIERTO,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      user: ticketData.usuarioActual,
      equipo: equipoSeleccionado,
      comments: [] // Inicializamos con un array vacío de comentarios
      // tecnico: ticketData.usuarioActual
    };
    this.tickets.update(listaActual => [nuevoTicket, ...listaActual]); // Agregamos el nuevo ticket al array de tickets
      }

      // 4. NUEVA FUNCIÓN AGREGAR COMENTARIO
      agregarComentario(ticketId: string, mensaje: string, usuario: UserBasic) {
        this.tickets.update(listaTickets => {
          // Mapeamos la lista de tickets para encontrar el correcto y actualizarlo
          return listaTickets.map(ticket => {
            if (ticket.id === ticketId) {

              // Creamos el nuevo comentario con el formato de tu base de datos
              const nuevoComentario = {
                id: crypto.randomUUID(),
                message: mensaje,
                createdAt: new Date(),
                user: usuario
              };

              // Retornamos el ticket actualizado, agregando el comentario a su historial
              return {
                ...ticket,
                comments: [...(ticket.comments || []), nuevoComentario]
              };
            }
            return ticket;
          });
        });
      }

      // 5. ASIGNAR TECNICO A UN TICKET
      asignarTecnico(ticketId: string, tecnico: UserBasic) {
        this.tickets.update(lista => lista.map(ticket => {
          if (ticket.id === ticketId) {
            return { ...ticket, tecnico: tecnico, status: TicketStatus.EN_PROGRESO };
          }
          return ticket;
        }));
      }

      // 6. CAMBIAR EL ESTADO DE UN TICKET
      cambiarEstado(ticketId: string, nuevoEstado: TicketStatus) {
        this.tickets.update(lista => lista.map(ticket => {
          if (ticket.id === ticketId) {
            return { ...ticket, status: nuevoEstado };
          }
          return ticket;
        }));
      }
    }


