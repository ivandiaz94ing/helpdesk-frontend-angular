import { User } from "../../auth/interfaces/user.interface";

export interface Equipo {
  id: string;               // Lo genera la base de datos
  nombre: string;
  modelo: string;
  marca: string;
  numeroSerie: string;
  isActive: boolean;
  user: User
  }

export interface CreateEquipoDto {
  id: string;               // Lo genera la base de datos
  nombre: string;
  modelo: string;
  marca: string;
  numeroSerie: string;
  usuarioResponsableId: string,
  isActive: boolean;
  }
