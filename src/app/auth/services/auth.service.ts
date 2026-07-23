import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth.response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = 'http://localhost:3000/';
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

  private handleAuthSuccess({user, token}: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(err: any) {
    this.clearSession();
    return of(false);
  }

  private clearSession(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  //Register
}
