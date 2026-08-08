import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

