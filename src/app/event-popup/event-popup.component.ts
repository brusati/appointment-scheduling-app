// event-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarDay, CalendarEvent } from '../calendar/calendar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CalendarEventAdd {
  nombre_paciente: string;
  fecha_turno: Date;
  pago_senia: boolean;
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
  pago_senia: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public day: CalendarDay,
    private http: HttpClient,
    private snackBar: MatSnackBar // Add MatSnackBar here
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
      pago_senia: this.pago_senia,
    };

    const timeParts = this.hora.split(':');
    newEvent.fecha_turno.setHours(parseInt(timeParts[0], 10));
    newEvent.fecha_turno.setMinutes(parseInt(timeParts[1], 10));

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers };

    this.http.post('http://127.0.0.1:8000/turno/', newEvent, options).subscribe(
      (response) => {
        const calendarEventResponse = response as CalendarEvent;
  
        const dateObj = new Date(calendarEventResponse?.fecha_turno);
  
        calendarEventResponse['hour'] = (dateObj.getHours() - 3).toString();
        calendarEventResponse['minute'] = dateObj.getMinutes().toString();
  
        if (this.day.events === undefined) {
          this.day.events = [calendarEventResponse];
        } else {
          this.day.events.push(calendarEventResponse);
        }
  
        this.nombre_paciente = '';
        this.hora = '';
      },
      (error) => {
        console.error('Error:', error.error.detail);
        this.snackBar.open(error.error.detail, 'Dismiss', {
          duration: 5000,
        });
      }
    );

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
