import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Ticket, TicketCategory } from '../../interfaces/ticket.interface';
import { TicketService } from '../../services/ticket.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-admin-reportes',
  imports: [],
  templateUrl: './admin-reportes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReportesComponent implements OnInit {
  private ticketService = inject(TicketService);

  public tickets = signal<Ticket[]>([]);

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(data => {
      this.tickets.set(data);
    });
  }

  exportarCSV(){
    const data = this.tickets();
    if(data.length === 0){
      alert('No hay tickets para exportar.');
      return;
    }

    // 1. Definimos los encabezados de las columnas
    const cabeceras = [
      'ID Ticket', 'Asunto', 'Estado', 'Prioridad', 'Categoria', 'Solicitante', 'Tecnico Asignado', 'Fecha Creacion'
    ];

    // 2. Extraemos los datos de cada ticket y los mapeamos a las columnas
    const filas = data.map(ticket => [
      ticket.id,
      `"${ticket.title}"`, // Ponemos comillas por si el título tiene comas (evita que se rompa el CSV)
      ticket.status,
      ticket.priority,
      ticket.category,
      `"${ticket.user.fullname || 'Sin registro'}"`,
      `"${ticket.tecnico?.fullname || 'Sin registro'}"`,
      new Date(ticket.createdAt).toLocaleDateString('es-ES')
    ]);

    // 3. Unimos todo con comas (,) y saltos de línea (\n)
    const contenidoCSV = [
      cabeceras.join(','),
      ...filas.map(fila => fila.join(','))
        ].join('\n');

    // 4. Truco del navegador para forzar la descarga del archivo
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Le ponemos un nombre dinamico con la fecha de hoy
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    link.setAttribute('download', `Reporte_MesaAyuda_${fechaHoy}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }


}
