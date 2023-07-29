// calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventPopupComponent } from '../event-popup/event-popup.component';

export interface CalendarDay {
  date: Date;
  events?: Event[];
}

export interface Event {
  title: string;
  hour: string;
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  currentMonth: Date = new Date();;
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeks: (CalendarDay | null)[][] = [];
  showDialog: boolean = false;
  selectedDay: CalendarDay | null = null;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    this.weeks = [];
    let currentWeek: (CalendarDay | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      currentWeek.push({ date });
      if (date.getDay() === 6) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      this.weeks.push(currentWeek);
    }
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
    console.log(this.currentMonth)
  }

  showEventDialog(day: CalendarDay): void {
    this.selectedDay = day;
    this.showDialog = true;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';

    dialogConfig.data = this.selectedDay; // You should provide the appropriate `CalendarDay` data here.

    this.dialog.open(EventPopupComponent, dialogConfig);
  }

  closeEventDialog(): void {
    this.showDialog = false;
    this.selectedDay = null;
  }
}
