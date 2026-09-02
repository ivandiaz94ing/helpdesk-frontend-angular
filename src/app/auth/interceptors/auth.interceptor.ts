import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  //1. Obtengo el token del servicio
  const token = inject(AuthService).token();

  //2. EXEPCIONES: Si la ruta es publica la dejo pasar sin el token
  if (req.url.endsWith('login') || req.url.endsWith('register')) {
    return next(req);
  }

  //3. Si No es publica y tengo un token, clonar e injectar
  if (token) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
    return next(newReq);
  }

  //4. Si no hat token y no es una ruta publica, igual se deja pasar
  return next(req);
}
