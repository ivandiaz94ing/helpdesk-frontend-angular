import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-modal-nuevo-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-nuevo-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalNuevoUsuarioComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public crearUsuarioForm = this.fb.group({
    fullname: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(200)],
    ],
    email: ['', [Validators.required, Validators.email]],
    role: ['client', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(35),
        Validators.pattern(
          /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        ),
      ],
    ],
  });

  // MAGIA NUEVA: Creamos un "Grito" para avisarle al padre
  public usuarioCreadoExito = output<void>();

  crearUsuario() {
    if (this.crearUsuarioForm.invalid) return;

    const { fullname, email, password, role } = this.crearUsuarioForm.value;

    this.authService
      .crearUsuarioAdmin(fullname!, email!, password!, role!)
      .subscribe((exito) => {
        if (exito) {
          console.log('¡Usuario creado con exito!');
          const modal = document.getElementById(
            'modalNuevoUsuario',
          ) as HTMLDialogElement;
          modal.close();
          this.usuarioCreadoExito.emit();

          this.crearUsuarioForm.reset({ role: 'client' });
        } else {
          alert('Hubo un error al crear el usuario');
        }
      });
  }
}
