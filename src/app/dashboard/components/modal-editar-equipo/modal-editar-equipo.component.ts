import { ChangeDetectionStrategy, Component, inject, output, signal, effect, OnInit, input } from '@angular/core';
import { Equipo } from '../../interfaces/ticket.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { EquipoService } from '../../services/equipo.service';
import { User } from '../../../auth/interfaces/user.interface';
import { CreateEquipoDto } from '../../interfaces/equipo.interface';

@Component({
  selector: 'app-modal-editar-equipo',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-equipo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditarEquipoComponent implements OnInit {
  constructor() {
    effect(() => {
      const equipo = this.equipo();

      if (equipo) {
        this.editarEquipoForm.patchValue({
          nombre: equipo.nombre,
          modelo: equipo.modelo,
          marca: equipo.marca,
          numeroSerie: equipo.numeroSerie,
          isActive: equipo.isActive,
          usuarioResponsableId: equipo.user?.id
        });
      }
    });
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe(users =>{
      this.listaUsuarios.set(users);

    });
  }
  public equipo = input<Equipo | null>(null);
  public fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public equipoService = inject(EquipoService);

  public equipoEditadoExito = output<void>();

  public listaUsuarios = signal<User[]>([]);

  public editarEquipoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    modelo: ['', [Validators.required, Validators.minLength(4)]],
    marca: ['', [Validators.required, Validators.minLength(2)]],
    numeroSerie: ['', [Validators.required, Validators.minLength(5)]],
    usuarioResponsableId: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  });

  guardarEdicion(){
    if(this.editarEquipoForm.invalid) return;

    // Extrae el ID del equipo que estamos editando actualmente
    const equipoId = this.equipo()?.id;
    if(!equipoId) return;

    const datosActualizados = this.editarEquipoForm.value as Partial<CreateEquipoDto>;

    this.equipoService.editarEquipo(equipoId, datosActualizados).subscribe(exito =>{
      if(exito){
        //Cierro el modal
        const modal = document.getElementById('modalEditarEquipo') as HTMLDialogElement;
        if(modal) modal.close();
        // ¡Grito éxito para que la tabla principal se recargue!
        this.equipoEditadoExito.emit();
      }else{
        alert("Hubo un error al actualizar el equipo");
      }
    });
  }

}
