import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate', // Así lo llamas en el HTML
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const timeString = date
      .toLocaleTimeString('es-ES', timeOptions)
      .toUpperCase();

    // Comparamos si es hoy
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Hoy ${timeString}`;
    }

    // Comparamos si es ayer
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Ayer ${timeString}`;
    }

    // Si es más antiguo
    return `${date.toLocaleDateString('es-ES')} ${timeString}`;
  }
}
