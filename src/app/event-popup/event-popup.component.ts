// event-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarDay, Event } from '../calendar/calendar.component';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css'],
})
export class EventPopupComponent {
  newEvent: Event = { title: '', hour: '' };

  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public day: CalendarDay
  ) {}

  addEvent(): void {
    if (!this.day.events) {
      this.day.events = [];
    }
    this.day.events.push({ ...this.newEvent });
    this.newEvent.title = '';
    this.newEvent.hour = '';
    this.sortEventsByHour();
  }

  private sortEventsByHour(): void {
    if (this.day && this.day.events) {
      this.day.events.sort((a, b) => {
        const [aHours, aMinutes] = a.hour.split(':').map(Number);
        const [bHours, bMinutes] = b.hour.split(':').map(Number);

        if (aHours !== bHours) {
          return aHours - bHours;
        }
        return aMinutes - bMinutes;
      });
    }
  }

  deleteEvent(index: number): void {
    if (this.day.events && this.day.events.length > index) {
      this.day.events.splice(index, 1);
    }
  }

  cancelEvent(): void {
    this.dialogRef.close();
  }
}
