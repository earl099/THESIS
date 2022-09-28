import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-schedule-profile',
  templateUrl: './schedule-profile.component.html',
  styleUrls: ['./schedule-profile.component.scss']
})
export class ScheduleProfileComponent implements OnInit {
  schedule: any = []

  identifiers = [
    'Schedule Code',
    'Subject Code',
    'Semester',
    'School Year',
    'Slots',
    'Subject Type',
    'Section',
    'Graded',
    'Date Graded',
    'Time in 1',
    'Time out 1',
    'Day 1',
    'Room 1',
    'Time in 2',
    'Time out 2',
    'Day 2',
    'Room 2',
  ]

  schedcode: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) {
    this.schedcode = Number(this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString());
  }

  ngOnInit(): void {
    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getSchedule(this.schedcode).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.schedule = res.schedule;
      }
    })
  }
}
