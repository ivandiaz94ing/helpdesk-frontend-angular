 // Enums basados en tu backend
    export enum TicketPriority {
      BAJA = 'BAJA',
      MEDIA = 'MEDIA',
      ALTA = 'ALTA',
    }

    export enum TicketCategory {
      FALLA_RED = 'Falla_de_red',
      HARDWARE = 'Hardware_dañado',
      SOFTWARE = 'Solicitud_de_software',
      OTROS = 'Otros'
    }

    export enum TicketStatus {
      ABIERTO = 'abierto',
      EN_PROCESO = 'en proceso',
      CERRADO = 'cerrado'
    }

    // Interfaz para el Usuario básico (Basado en lo que retorna tu relación)
    export interface UserBasic {
      id: string;
      email: string;
      fullname: string;
    }

    // Interfaz del Equipo
    export interface Equipo {
      id: string;
      nombre: string;
      marca: string;
      modelo: string;
      numeroSerie: string;
      isActive: boolean;
      user?: UserBasic; // El funcionario al que pertenece
    }

    // Interfaz del Comentario
    export interface Comment {
      id: string;
      message: string;
      createdAt: Date;
      user: UserBasic; // Quién escribió el comentario
    }

    // Interfaz Principal del Ticket
    export interface Ticket {
      id: string;
      title: string;
      description: string;
      images: string[];
      priority: TicketPriority;
      category: TicketCategory;
      status: TicketStatus;
      createdAt: Date;
      updatedAt: Date | null;
      deletedAt?: Date | null;

      // Relaciones (En tu backend 'user' y 'equipo' son eager, así que siempre vendrán)
      user: UserBasic;
      equipo: Equipo;

      // Relaciones opcionales
      tecnico?: UserBasic;
      comments?: Comment[];
    }

    export interface CreateTicketDTO {
      title: string;
      description: string;
      priority: TicketPriority;
      category: TicketCategory;
      equipoId: string; // ID del equipo al que pertenece el ticket
    }
