// event-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarDay, CalendarEvent } from '../calendar/calendar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CalendarEventAdd {
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
  formattedTime: string = '';

  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public day: CalendarDay,
    private http: HttpClient
  ) {
    this.sortEventsByHour();
  }

  ngOnInit() {
    this.sortEventsByHour();
  }

  addEvent(): void {
    let newEvent: CalendarEventAdd = {
      nombre_paciente: this.nombre_paciente,
      fecha_turno: this.day.date,
    };

    const timeParts = this.hora.split(':');
    newEvent.fecha_turno.setHours(parseInt(timeParts[0], 10));
    newEvent.fecha_turno.setMinutes(parseInt(timeParts[1], 10));

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    this.http.post('http://127.0.0.1:8000/turno/', newEvent, options).subscribe((response) => {
      const calendarEventResponse = response as CalendarEvent;

      const dateObj = new Date(calendarEventResponse?.fecha_turno);

      calendarEventResponse['hour'] = (dateObj.getHours() - 3).toString();
      calendarEventResponse['minute'] = dateObj.getMinutes().toString();


      console.log(calendarEventResponse)

      if (this.day.events === undefined) {
        this.day.events = [calendarEventResponse];
      } else {
        this.day.events.push(calendarEventResponse);
      }

      this.nombre_paciente = '';
      this.hora = '';
    });

    this.sortEventsByHour();
  }

  private sortEventsByHour(): void {
    if (this.day && this.day.events) {
      this.day.events.sort((a, b) => {
        if (a && a.hour && b && b.hour) {
          const [aHours, aMinutes] = a.hour.split(':').map(Number);
          const [bHours, bMinutes] = b.hour.split(':').map(Number);

          if (aHours !== bHours) {
            return aHours - bHours;
          }
          return aMinutes - bMinutes;
        }
        return 0;
      });
    }
  }



  deleteEvent(index: number): void {
    // if (this.day.events && this.day.events.length > index) {
    //   this.day.events.splice(index, 1);
    // }

    if (this.day && this.day.events) {
      let event = this.day.events[index];

      this.http.delete(`http://127.0.0.1:8000/turno/${event?.id}`).subscribe((response) => {
        if (this.day && this.day.events) {
          this.day.events.splice(index);
        }
      });

    }
  }

  cancelEvent(): void {
    this.dialogRef.close();
  }

  formatTimeToISO() {
    if (this.hora) {
      const timeParts = this.hora.split(':');
      const currentDateTime = new Date();
      const formattedTime = new Date(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDate(),
        parseInt(timeParts[0], 10),
        parseInt(timeParts[1], 10),
        0
      ).toISOString();
      this.formattedTime = formattedTime;
    }
  }


}
