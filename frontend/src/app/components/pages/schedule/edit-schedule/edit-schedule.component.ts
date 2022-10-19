import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {
  counter = 0;
  angForm: any;
  schedcode: any;
  schedule: any;
  scheduleCheckers: string[] = [
    'N',
    'N',
    'N',
    'N',
  ];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.schedcode = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString();
  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value: '', disabled: false }),
      units: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false }),
      slots: new FormControl({ value: '', disabled: false }),
      subjectype: new FormControl({ value: '', disabled: false }),
      section: new FormControl({ value: '', disabled: false }),
      instructor: new FormControl({ value: '', disabled: false }),
      tuition: new FormControl({ value: '', disabled: false }),
      graded: new FormControl({ value: '', disabled: false }),
      gradeddate: new FormControl({ value: '', disabled: false }),
      timein1: new FormControl({ value: '', disabled: false }),
      timeout1: new FormControl({ value: '', disabled: false }),
      day1: new FormControl({ value: '', disabled: false }),
      room1: new FormControl({ value: '', disabled: false }),
      timein2: new FormControl({ value: '', disabled: false }),
      timeout2: new FormControl({ value: '', disabled: false }),
      day2: new FormControl({ value: '', disabled: false }),
      room2: new FormControl({ value: '', disabled: false }),
      timein3: new FormControl({ value: '', disabled: false }),
      timeout3: new FormControl({ value: '', disabled: false }),
      day3: new FormControl({ value: '', disabled: false }),
      room3: new FormControl({ value: '', disabled: false }),
      timein4: new FormControl({ value: '', disabled: false }),
      timeout4: new FormControl({ value: '', disabled: false }),
      day4: new FormControl({ value: '', disabled: false }),
      room4: new FormControl({ value: '', disabled: false }),
      ok1: new FormControl({ value: '', disabled: false }),
      ok2: new FormControl({ value: '', disabled: false }),
      ok3: new FormControl({ value: '', disabled: false }),
      ok4: new FormControl({ value: '', disabled: false }),
      oras: new FormControl({ value: '', disabled: false }),
      ojt: new FormControl({ value: '', disabled: false }),
      petition: new FormControl({ value: '', disabled: false }),
      thesis: new FormControl({ value: '', disabled: false }),
      labunits: new FormControl({ value: '', disabled: false }),
      internet: new FormControl({ value: '', disabled: false }),
      residency: new FormControl({ value: '', disabled: false }),
      encodegrade: new FormControl({ value: '', disabled: false }),
      gradingpart: new FormControl({ value: '', disabled: false })
    })

    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getSchedule(Number(this.schedcode)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.schedule = res.schedule;
        console.log(this.schedule)
        this.angForm.get('schedcode').setValue(this.schedule.schedcode)
        this.angForm.get('subjectCode').setValue(this.schedule.subjectCode)
        this.angForm.get('units').setValue(this.schedule.units)
        this.angForm.get('semester').setValue(this.schedule.semester)
        this.angForm.get('schoolyear').setValue(this.schedule.schoolyear)
        this.angForm.get('slots').setValue(this.schedule.slots)
        this.angForm.get('subjectype').setValue(this.schedule.subjectype)
        this.angForm.get('section').setValue(this.schedule.section)
        this.angForm.get('instructor').setValue(this.schedule.instructor)
        this.angForm.get('tuition').setValue(this.schedule.tuition)
        this.angForm.get('graded').setValue(this.schedule.graded)
        this.angForm.get('gradeddate').setValue(this.schedule.gradeddate)
        this.angForm.get('timein1').setValue(this.schedule.timein1)
        this.angForm.get('timeout1').setValue(this.schedule.timeout1)
        this.angForm.get('day1').setValue(this.schedule.day1)
        this.angForm.get('room1').setValue(this.schedule.room1)
        this.angForm.get('timein2').setValue(this.schedule.timein2)
        this.angForm.get('timeout2').setValue(this.schedule.timeout2)
        this.angForm.get('day2').setValue(this.schedule.day2)
        this.angForm.get('room2').setValue(this.schedule.room2)
        this.angForm.get('timein3').setValue(this.schedule.timein3)
        this.angForm.get('timeout3').setValue(this.schedule.timeout3)
        this.angForm.get('day3').setValue(this.schedule.day3)
        this.angForm.get('room3').setValue(this.schedule.room3)
        this.angForm.get('timein4').setValue(this.schedule.timein4)
        this.angForm.get('timeout4').setValue(this.schedule.timeout4)
        this.angForm.get('day4').setValue(this.schedule.day4)
        this.angForm.get('room4').setValue(this.schedule.room4)

        if(this.angForm.get('timein1').value != 'N/A') {
          this.scheduleCheckers[0] = 'Y'
          this.angForm.get('ok1').setValue(this.scheduleCheckers[0])
        }
        if(this.angForm.get('timein2').value != 'N/A') {
          this.scheduleCheckers[1] = 'Y'
          this.angForm.get('ok2').setValue(this.scheduleCheckers[1])
        }
        if(this.angForm.get('timein3').value != 'N/A') {
          this.scheduleCheckers[2] = 'Y'
          this.angForm.get('ok3').setValue(this.scheduleCheckers[2])
        }
        if(this.angForm.get('timein4').value != 'N/A') {
          this.scheduleCheckers[3] = 'Y'
          this.angForm.get('ok4').setValue(this.scheduleCheckers[3])
        }

        this.angForm.get('oras').setValue(this.schedule.oras)
        this.angForm.get('ojt').setValue(this.schedule.ojt)
        this.angForm.get('petition').setValue(this.schedule.petition)
        this.angForm.get('thesis').setValue(this.schedule.thesis)
        this.angForm.get('labunits').setValue(this.schedule.labunits)
        this.angForm.get('internet').setValue(this.schedule.internet)
        this.angForm.get('residency').setValue(this.schedule.residency)
        this.angForm.get('encodegrade').setValue(this.schedule.encodegrade)
        this.angForm.get('gradingpart').setValue(this.schedule.gradingpart)
      }
    })
  }


}
