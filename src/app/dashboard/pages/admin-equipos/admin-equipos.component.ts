import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipo } from '../../interfaces/ticket.interface';
import { EquipoService } from '../../services/equipo.service';
import { ModalNuevoEquipoComponent } from "../../components/modal-nuevo-equipo/modal-nuevo-equipo.component";
import { ModalConfirmacionComponent } from "../../../shared/components/modal-confirmacion/modal-confirmacion.component";

@Component({
  selector: 'app-admin-equipos',
  imports: [CommonModule, ModalNuevoEquipoComponent, ModalConfirmacionComponent],
  templateUrl: './admin-equipos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminEquiposComponent implements OnInit {
  //Inyecto puente de la comunicacion
  private equipoService = inject(EquipoService);

  // Señal para recordar a quien voy a eliminar
    public equipoAEliminar = signal<{ id: string; nombre: string } | null>(null);

  // Término de búsqueda
  public terminoBusqueda = signal('');

  //Lista de equipos
  public equiposOriginales = signal<Equipo[]>([]);


  // Filtro reactivo mágico
  public equiposFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const lista = this.equiposOriginales();

    if (!termino) return lista;

    return lista.filter(eq =>
      eq.nombre.toLowerCase().includes(termino) ||
      eq.numeroSerie.toLowerCase().includes(termino) ||
      eq.marca.toLowerCase().includes(termino)
    );
  });

  // cargar datos de los equipos al iniciar el componente
  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(){
    this.equipoService.getEquipos().subscribe(equiposBack => {
      this.equiposOriginales.set(equiposBack);
    });
  }

  buscar(texto: string) {
    this.terminoBusqueda.set(texto);
  }

  // Las funciones de los modales (las conectaremos en el siguiente paso)
  abrirModalNuevo() {
    const modal = document.getElementById('modalNuevoEquipo') as HTMLDialogElement;
    modal.showModal();
  }

  prepararEdicion(equipo: Equipo) {
    console.log("Preparar edición para:", equipo);
  }

  prepararEliminar(id: string, nombre: string) {
    this.equipoAEliminar.set({id, nombre});
    const modal = document.getElementById('modalEliminarEquipo') as HTMLDialogElement;
    modal.show();
  }

  eliminarEquipo() {
  const equipoId = this.equipoAEliminar()?.id;
  if (!equipoId) return;
      this.equipoService.eliminarEquipo(equipoId).subscribe(exito => {
      if (exito) {
        this.cargarEquipos();
      } else {
        alert("Hubo un error al eliminar el usuario");
      }
    });
  }
}
