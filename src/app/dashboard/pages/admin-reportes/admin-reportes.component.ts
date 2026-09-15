import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../interfaces/ticket.interface';
import { TicketService } from '../../services/ticket.service';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { list } from 'postcss';
import { input } from '@angular/core';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-reportes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReportesComponent implements OnInit {
  private ticketService = inject(TicketService);

  public tickets = signal<Ticket[]>([]);

  public fechaInicio = signal<string>('');
  public fechaFin = signal<string>('');

  public ticketsFiltrados = computed(() => {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    let lista = this.tickets();

    if(inicio){
      const fechaDesde = new Date(inicio + 'T00:00:00');
      lista = lista.filter((t) => new Date(t.createdAt) >= fechaDesde);
    }

    if (fin) {
      const fechaHasta = new Date(fin + 'T23:59:59');
      lista = lista.filter((t) => new Date(t.createdAt) <= fechaHasta);
    }
    return lista;
  });

  //Funciones para atrapar los cambios en los calendarios
  setFechaInicio(event: Event){
    const input = event.target as HTMLInputElement;
    this.fechaInicio.set(input.value);
  }

  setFechaFin(event: Event){
    const input = event.target as HTMLInputElement;
    this.fechaFin.set(input.value);
  }



  public totalTickets = computed(() => this.ticketsFiltrados().length);

  public ticketsResueltos = computed(
    () => this.ticketsFiltrados().filter((t) => t.status === 'cerrado').length,
  );

  public ticketsPendientes = computed(
    () => this.ticketsFiltrados().filter((t) => t.status !== 'cerrado').length,
  );

  public pieChartData = computed(() => {
    const lista = this.ticketsFiltrados();
    const red = lista.filter((t) => t.category === 'Falla_de_red').length;
    const hardware = lista.filter(
      (t) => t.category === 'Hardware_dañado',
    ).length;
    const software = lista.filter(
      (t) => t.category === 'Solicitud_de_software',
    ).length;
    const otros = lista.filter((t) => t.category === 'Otros').length;

    return {
      labels: ['Falla de Red', 'Hardware', 'Software', 'Otros'],
      datasets: [
        {
          data: [red, hardware, software, otros],
          backgroundColor: ['#ef4444', '#f97316', '#3b82f6', '#94a3b8'],
        },
      ],
    };
  });

  public barChartData = computed(() => {
    return {
      labels: ['Comparativa de Resoluciones'],
      datasets: [
        {
          data: [this.ticketsPendientes()],
          label: 'Pendientes',
          backgroundColor: '#fb923c',
        },
        {
          data: [this.ticketsResueltos()],
          label: 'Resueltos',
          backgroundColor: '#34d399',
        },
      ],
    };
  });



  ngOnInit(): void {
    this.ticketService.getTickets(1000, 0).subscribe((data) => {
      this.tickets.set(data.data);
    });
  }

  exportarCSV() {
    const data = this.tickets();
    if (data.length === 0) {
      alert('No hay tickets para exportar.');
      return;
    }

    const cabeceras = [
      'ID Ticket',
      'Asunto',
      'Estado',
      'Prioridad',
      'Categoria',
      'Solicitante',
      'Tecnico Asignado',
      'Fecha Creacion',
    ];

    const filas = data.map((ticket) => [
      ticket.id,
      `"${ticket.title}"`,
      ticket.status,
      ticket.priority,
      ticket.category,
      `"${ticket.user?.fullname || 'Sin registro'}"`,
      `"${ticket.tecnico?.fullname || 'Sin asignar'}"`,
      new Date(ticket.createdAt).toLocaleDateString('es-ES'),
    ]);

    const contenidoCSV = [
      cabeceras.join(','),
      ...filas.map((fila) => fila.join(',')),
    ].join('\n');

    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const fechaHoy = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Reporte_MesaAyuda_${fechaHoy}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 1. Configuramos cómo se van a ver las etiquetas
      public pieChartOptions = {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#ffffff', // Letras blancas
            font: { weight: 'bold' as const, size: 14 },
            // Esta funcioncita convierte el número a porcentaje
            formatter: (value: number, ctx: any) => {
              if (value === 0) return ''; // Si la tajada está en cero, no mostramos nada

              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data: number) => { sum += data; });

              let percentage = ((value * 100) / sum).toFixed(1) + '%';
              return percentage;
            }
          }
        }
      };

   // 2. Le decimos a la gráfica que cargue este plugin
      public pieChartPlugins = [ChartDataLabels];

  public barChartOptions = {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#ffffff', // Letras blancas (o pon '#000000' si tus barras son muy claras)
            font: { weight: 'bold' as const, size: 14 },
            // En las barras, solo mostramos el valor real, no el porcentaje
            formatter: (value: number) => {
              return value > 0 ? value : ''; // Muestra el número si es mayor a cero
            }
          }
        }
      };

    // Podemos usar el mismo arreglo de plugins que creaste para el pastel
    public barChartPlugins = [ChartDataLabels];
}
