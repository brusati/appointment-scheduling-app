// event-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarDay } from '../calendar/calendar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CalendarEvent {
  nombre_paciente: string;
  fecha_turno: Date;
}

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css'],
})
export class EventPopupComponent {

  nombre_paciente: string = '';
  hora: string = '';

  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public day: CalendarDay,
    private http: HttpClient
  ) {}

  addEvent(): void {
    let newEvent: CalendarEvent = {
      nombre_paciente: this.nombre_paciente,
      fecha_turno: this.day.date,
    };

    const timeParts = this.hora.split(':');
    newEvent.fecha_turno.setHours(parseInt(timeParts[0], 10));
    newEvent.fecha_turno.setMinutes(parseInt(timeParts[1], 10));

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, withCredentials: true };

    this.http.post('http://127.0.0.1:8000/turno/', newEvent, options).subscribe((response) => {
    });
  }

  // private sortEventsByHour(): void {
  //   if (this.day && this.day.events) {
  //     this.day.events.sort((a, b) => {
  //       const [aHours, aMinutes] = a.hour.split(':').map(Number);
  //       const [bHours, bMinutes] = b.hour.split(':').map(Number);

  //       if (aHours !== bHours) {
  //         return aHours - bHours;
  //       }
  //       return aMinutes - bMinutes;
  //     });
  //   }
  // }

  deleteEvent(index: number): void {
    if (this.day.events && this.day.events.length > index) {
      this.day.events.splice(index, 1);
    }
  }

  cancelEvent(): void {
    this.dialogRef.close();
  }
}
