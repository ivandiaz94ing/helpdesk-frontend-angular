import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  // 1. Entradas (Lo que recibe del componente padre)
  public total = input.required<number>();
  public offset = input.required<number>();
  public limit = input<number>(10);

  // 2. Salidas (Lo que emite al componente padre)
  public onPageChange = output<number>();

  // 3. Matematicas para pintar los botones
  public paginas = computed(() => {
    //Si no hay total, devolvemos un array vacío
    if (!this.total) return [];

    //Calculamos el total de páginas
    const totalPaginas = Math.ceil(this.total() / this.limit());
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);

});

// 4. Avisar al componente padre que se ha cambiado de página
cambiarPagina(pagina: number) {
  const nuevoOffset = (pagina - 1) * this.limit();
  this.onPageChange.emit(nuevoOffset);
}
}

