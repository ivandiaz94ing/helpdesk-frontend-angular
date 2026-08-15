import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipoService } from '../../services/equipo.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { CreateEquipoDto } from '../../interfaces/equipo.interface';

@Component({
  selector: 'app-modal-nuevo-equipo',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-nuevo-equipo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalNuevoEquipoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private equipoService = inject(EquipoService);
  private authService = inject(AuthService);

  // Grito de éxito para avisar que recargue la tabla
  public equipoCreadoExito = output<void>();

  // La lista de usuarios para el <select>
  public listaUsuarios = signal<User[]>([]);

  public crearEquipoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    modelo: ['', [Validators.required, Validators.minLength(2)]],
    marca: ['', [Validators.required]],
    numeroSerie: ['', [Validators.required, Validators.minLength(5)]],
    usuarioResponsableId: ['', [Validators.required]],
    isActive: [true] // Por defecto, al crearse está activo
  });

  //Al abrir el modal se cargan los usuarios
  ngOnInit(): void {
    this.authService.getUsers().subscribe(users => {
      this.listaUsuarios.set(users);
    });
  }

  crearEquipo(){
    if(this.crearEquipoForm.invalid) return;

    const datosNuevos = this.crearEquipoForm.value as CreateEquipoDto;

    this.equipoService.crearEquipo(datosNuevos).subscribe(exito =>{
      if(exito){
        const modal = document.getElementById('modalNuevoEquipo') as HTMLDialogElement;
        modal.close();

        this.equipoCreadoExito.emit();
        this.crearEquipoForm.reset({ isActive: true});
      } else {
        alert('Error al crear el equipo');
      }
    });
  }
}
