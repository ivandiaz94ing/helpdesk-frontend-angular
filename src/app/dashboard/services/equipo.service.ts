import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, map } from 'rxjs';
import { Equipo } from '../interfaces/ticket.interface';
import { CreateEquipoDto } from '../interfaces/equipo.interface';

const baseUrl = 'https://helpdesk-backend-api-54750791481.southamerica-east1.run.app/';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private http = inject(HttpClient);

    // 1. OBTENER TODOS LOS EQUIPOS (GET /equipo)
      getEquipos(): Observable<Equipo[]> {
        return this.http.get<Equipo[]>(`${baseUrl}equipo`).pipe(
          catchError(err => {
            console.error('Error al cargar equipos:', err);
            return of([]);
          })
        );
      }

      // 2. CREAR EQUIPO (POST /equipo)
      crearEquipo(datos: CreateEquipoDto): Observable<boolean> {
        return this.http.post<Equipo>(`${baseUrl}equipo`, datos).pipe(
          map(() => true),
          catchError(err => {
            console.error('Error al crear equipo:', err);
            return of(false);
          })
        );
      }

      // 3. EDITAR EQUIPO (PATCH /equipo/:id)
      editarEquipo(id: string, datos: CreateEquipoDto): Observable<boolean> {
        return this.http.patch(`${baseUrl}equipo/${id}`, datos).pipe(
          map(() => true),
          catchError(err => {
            console.error('Error al editar equipo:', err);
            return of(false);
          })
        );
      }

      // 4. ELIMINAR EQUIPO (DELETE /equipo/:id)
      eliminarEquipo(id: string): Observable<boolean> {
        return this.http.delete(`${baseUrl}equipo/${id}`).pipe(
          map(() => true),
          catchError(err => {
            console.error('Error al eliminar equipo:', err);
            return of(false);
          })
        );
      }


}
