import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalNuevoUsuarioComponent } from "../../components/modal-nuevo-usuario/modal-nuevo-usuario.component";

@Component({
  selector: 'app-admin-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalNuevoUsuarioComponent
],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit {
  private authService = inject(AuthService);


  // Señal para recordar a quien voy a eliminar
  public usuarioAEliminar = signal<{ id: string; nombre: string } | null>(null);
  // Señal para guardar los datos del usuario que se va a editar
  public usuarioAEditar = signal<User | null>(null);
  // Señal para guardar el texto que el usuario escribe en el buscador
  public terminoBusqueda = signal('');

  // La lista original de todos los usuarios (le cambiamos el nombre a usuariosOriginales)
  public usuariosOriginales = signal<User[]>([]);

  // LA MAGIA: Una señal computada que se actualiza sola cuando escribes
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

  ngOnInit(): void {
    // Inicializamos la lista original de usuarios
    this.cargarUsuarios();
  }
  cargarUsuarios() {
    this.authService.getUsers().subscribe(users => {
      this.usuariosOriginales.set(users);
    });
  }
  prepararEliminarUsuario(id: string, nombre: string) {
    this.usuarioAEliminar.set({ id , nombre});
    // Uso document.getElementById para abrir el modal desde TS
    const modal = document.getElementById('modalEliminar') as HTMLDialogElement;
    modal.showModal();
  }

  prepararEdicion(usuario: User) {
    this.usuarioAEditar.set(usuario);
    // Uso document.getElementById para abrir el modal desde TS
    const modal = document.getElementById('modalEditarUsuario') as HTMLDialogElement;
    modal.showModal();
  }

  confirmarEliminacion( ) {
    const usuarioId = this.usuarioAEliminar()?.id;
    if (!usuarioId) return;

    this.authService.eliminarUsuarioAdmin(usuarioId).subscribe(exito => {
      if (exito) {
        //window.location.reload();
        const modal = document.getElementById('modalEliminar') as HTMLDialogElement;
        modal.close();
        //recargo solo la lista de usuarios
        this.cargarUsuarios();
      } else {
        alert("Hubo un error al eliminar el usuario");
      }
    });

  }

  guardarEdicion(fullname: string, email: string, rol: string) {
    const usuarioId = this.usuarioAEditar()?.id;
    if (!usuarioId) return;

    const datos = {fullname, email, role: rol };

    this.authService.editarUsuarioAdmin(usuarioId, datos).subscribe(exito => {
      if (exito) {
        //window.location.reload();
        //cierro el modal
        const modal = document.getElementById('modalEditarUsuario') as HTMLDialogElement;
        modal.close();
        //recargo solo la lista de usuarios
        this.cargarUsuarios();
      } else {
        alert("Hubo un error al editar el usuario");
      }
    });

  }










    //Paso el nuevo parametro al servicio
  }

