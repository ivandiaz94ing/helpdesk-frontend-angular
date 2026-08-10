import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-modal-eliminar-usuario',
  imports: [],
  templateUrl: './modal-eliminar-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEliminarUsuarioComponent {
   private authService = inject(AuthService);

      // 1. Recibimos qué usuario se va a eliminar
      public usuarioAEliminar = input<{ id: string; nombre: string } | null>(null);

      // 2. Avisamos al padre cuando terminemos
      public usuarioEliminadoExito = output<void>();

      // 3. Pegamos la función de confirmación (la que borramos del padre)
      confirmarEliminacion() {
        const usuarioId = this.usuarioAEliminar()?.id;
        if (!usuarioId) return;

        this.authService.eliminarUsuarioAdmin(usuarioId).subscribe(exito => {
          if (exito) {
            const modal = document.getElementById('modalEliminar') as HTMLDialogElement;
            modal.close();

            // ¡Gritamos éxito!
            this.usuarioEliminadoExito.emit();
          } else {
            alert("Hubo un error al eliminar el usuario");
          }
        });
      }
 }
