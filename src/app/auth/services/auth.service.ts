import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth.response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = 'http://localhost:3000/';
@Injectable({providedIn: 'root'})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  autStatus = computed(() =>{
    if(this._authStatus()==='checking') return 'checking';

    if(this._user()){
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}user/login`, {
      email: email,
      password: password
    }).pipe(
      tap( (resp) => {
        this._user.set(resp.user);
        this._token.set(resp.token);
        this._authStatus.set('authenticated');

        localStorage.setItem('token', resp.token);
      }),
      map( () => true),
      catchError( (err : any) => {
        this.logout();
        return of(false);
      })
  );
  }
// Logout
  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  // Check Autentication
  checkAuthStatus(): Observable<boolean>{
    const token = localStorage.getItem('token');

    if(!token){
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}user/check-status`)
    .pipe(
      tap( ({user, token}: AuthResponse) => {
        this._user.set(user);
        this._token.set(token);
        this._authStatus.set('authenticated');
      }),
      map( () => true),
      catchError( () => {
        this.logout();
        return of(false);
      })
    );
  }

  //Register
  
}
