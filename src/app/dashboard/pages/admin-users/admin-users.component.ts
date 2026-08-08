import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent {
  private authService = inject(AuthService);
  public usuarios = toSignal(this.authService.getUsers(), { initialValue: [] });

  // 1. Señal para guardar el texto que el usuario escribe en el buscador
  public terminoBusqueda = signal('');

  // 2. La lista original de todos los usuarios (le cambiamos el nombre a usuariosOriginales)
  public usuariosOriginales = toSignal(this.authService.getUsers(), { initialValue: [] });

  // 3. LA MAGIA: Una señal computada que se actualiza sola cuando escribes
  public usuariosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const lista = this.usuariosOriginales();

    // Si no has escrito nada, mostramos todos
    if (!termino) return lista;

    // Si escribiste algo, filtramos por nombre o correo
    return lista.filter(user =>
      user.fullname.toLowerCase().includes(termino) ||
      user.email.toLowerCase().includes(termino)
    );
  });

  // 4. Función para actualizar el término desde el HTML
  buscar(texto: string) {
    this.terminoBusqueda.set(texto);
  }

  crearUsuario(nombre: string, correo: string, password: string, rol: string) {
    if (!nombre.trim() || !correo.trim() || !password.trim() || !rol.trim())
      return;
    this.authService.crearUsuarioAdmin(nombre, correo, password, rol).subscribe(exito => {

        if (exito) {
          console.log("¡Usuario creado con exito!");
          window.location.reload();
        } else {
          alert("Hubo un error al crear el usuario");
        }
          });
        }


    //Paso el nuevo parametro al servicio
  }

