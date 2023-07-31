import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezoneFormat'
})
export class TimezoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    // Assuming the input value is in UTC format (e.g., 'HH:mm:ss')
    // If your input value has a different format, adjust this accordingly.
    const timeParts = value.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}`;
  }

  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
