import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-modal-editar-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditarUsuarioComponent {
   private fb = inject(FormBuilder);
      private authService = inject(AuthService);

      // 1. Recibimos al usuario desde el Padre
      public usuario = input<User | null>(null);

      // 2. Nuestro Grito de éxito
      public usuarioEditadoExito = output<void>();

      // 3. El Formulario Reactivo (igualito al de crear, pero sin el password)
      public editarUsuarioForm = this.fb.group({
        fullname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['client', [Validators.required]],
      });

      // 4. El "Vigilante": Cuando el padre nos pase un usuario, rellenamos el formulario
      constructor() {
        effect(() => {
          const user = this.usuario();
          if (user) {
            this.editarUsuarioForm.patchValue({
              fullname: user.fullname,
              email: user.email,
              role: user.role
            });
          }
        });
      }

      // 5. La función para guardar
      guardarEdicion() {
        if (this.editarUsuarioForm.invalid) return;

        const userToEdit = this.usuario();
        if (!userToEdit) return;

        const { fullname, email, role } = this.editarUsuarioForm.value;
        const datos = { fullname: fullname!, email: email!, role: role! };

        this.authService.editarUsuarioAdmin(userToEdit.id, datos).subscribe(exito => {
          if (exito) {
            const modal = document.getElementById('modalEditarUsuario') as HTMLDialogElement;
            modal.close();

            // Le avisamos al padre que ya terminamos
            this.usuarioEditadoExito.emit();
          } else {
            alert("Hubo un error al editar el usuario");
          }
        });
      }
 }
