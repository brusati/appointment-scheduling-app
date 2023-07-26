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
  newEvent: Event = { title: '' };

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
  }

  deleteEvent(index: number): void {
    if (this.day.events && this.day.events.length > index) {
      this.day.events.splice(index, 1);
    }
  }
}
