import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [],
  templateUrl: './modal-confirmacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmacionComponent {
  // Textos personalizables que el padre le manda
  public idModal = input<string>('modalConfirmacion'); // Para que cada modal tenga un ID único

  public titulo = input<string>('¿Estás seguro?');
  public mensajePrincipal = input<string>('Esta acción es irreversible.');
  public textoResaltado = input<string | undefined>(''); // Ejemplo: El nombre del usuario o equipo

  public textoBoton = input<string>('Si, Continuar');

  // Evento que se dispara cuando dan clic en "Sí"
  public confirmado = output<void>();

  ejecutarConfirmacion() {
    // Cerramos el modal dinámicamente usando el ID que nos pasaron
    const modal = document.getElementById(this.idModal()) as HTMLDialogElement;
    if (modal) modal.close();

    // Le gritamos al padre que el usuario dijo que SÍ
    this.confirmado.emit();
  }
}
