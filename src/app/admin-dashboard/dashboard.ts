import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Declaramos un Signal que contiene un arreglo de tickets
  tickets = signal([
    { id: 1, issue: 'Fallo de red en la comandancia', status: 'Abierto' },
    { id: 2, issue: 'Impresora sin tóner', status: 'En progreso' },
    { id: 3, issue: 'Actualización de antivirus', status: 'Cerrado' }
  ]);
}
