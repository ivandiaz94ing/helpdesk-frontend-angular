import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth.response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
// const baseUrl = 'http://localhost:3000/';
const baseUrl =
  'https://helpdesk-backend-api-54750791481.southamerica-east1.run.app/';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  });

  autStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}user/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err: any) => this.handleAuthError(err)),
      );
  }
  // Logout
  logout() {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  // Check Autentication
  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.clearSession();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}user/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err: any) => this.handleAuthError(err)),
      );
  }

  private handleAuthSuccess({ user, token }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);

    return true;
  }

  // CONSULTAR USUARIOS
  getUsers(): Observable<User[]> {
    const token = this.token();
    if (!token) {
      return of([]);
    }

    return this.http.get<User[]>(`${baseUrl}user`);
  }

  // CREAR USUARIO DESDE EL PANEL ADMIN (Sin iniciar sesión)
  crearUsuarioAdmin(
    fullname: string,
    email: string,
    password: string,
    rol: string,
  ): Observable<boolean> {
    return this.http
      .post<User>(`${baseUrl}user/register-admin`, {
        fullname,
        email,
        password,
        role: rol,
      })
      .pipe(
        map(() => true), // Si todo sale bien, devolvemos verdadero
        catchError((err) => {
          console.error('Error creando usuario:', err);
          return of(false);
        }),
      );
  }

  // Register
  register(
    fullname: string,
    email: string,
    password: string,
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}user/register`, {
        fullname: fullname,
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err: any) => this.handleAuthError(err)),
      );
  }

  // EDITAR USUARIO
  editarUsuarioAdmin(id: string, datosActualizados: any): Observable<boolean> {
    return this.http
      .patch<User>(`${baseUrl}user/${id}`, datosActualizados)
      .pipe(
        map(() => true),
        catchError((err) => {
          console.error('Error al editar usuario:', err);
          return of(false);
        }),
      );
  }

  // ELIMINAR USUARIO DESDE EL PANEL ADMIN
  eliminarUsuarioAdmin(userId: string): Observable<boolean> {
    return this.http.delete(`${baseUrl}user/${userId}`).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Error al eliminar usuario:', err);
        return of(false);
      }),
    );
  }

  private handleAuthError(err: any) {
    this.clearSession();
    return of(false);
  }

  private clearSession() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }
}
