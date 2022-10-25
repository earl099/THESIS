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
  angForm: any;
  schedcode: any;
  schedule: any;
  scheduleCheckers: string[] = [
    'N',
    'N',
    'N',
    'N',
  ];

  counter = 0;
  visibleAddBtn = true;
  visibleDeleteBtn = false;
  scheduleFields: boolean[] = [
    false,
    false,
    false
  ]


  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.schedcode = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString();
    console.log(this.schedcode)
  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
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
    })

    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getSchedule(Number(this.schedcode)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.schedule = res.schedule;
        console.log(this.schedule)
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

        this.checkerFunction()

        this.angForm.get('oras').setValue(this.schedule.oras)
      }
    })
  }

  onAddSchedule() {

    switch(this.counter) {
      case 0:
      case 1:
        this.scheduleFields[this.counter] = true
        this.counter++;
        break;

      case 2:
        this.scheduleFields[this.counter] = true
        this.visibleAddBtn = false;
        break;
    }
    this.visibleDeleteBtn = true;

    // console.log(this.scheduleFields)
    // console.log(this.counter)
  }

  onDeleteSchedule() {
    if(this.counter != 0) {
      switch(this.counter) {
        case 0:
          this.scheduleFields[this.counter] = false
          break;

        case 1:
        case 2:
          if(this.scheduleFields[this.counter]) {
            this.scheduleFields[this.counter] = false
            this.counter--;
          }
          else {
            this.counter--;
            this.scheduleFields[this.counter] = false
          }

          break;
      }
      this.visibleAddBtn = true

      console.log(this.scheduleFields)
      console.log(this.counter)
    }
    else if(this.counter == 0) {
      if(this.angForm.get('timein2').value != 'N/A') {
        this.scheduleFields[this.counter] = true
        this.visibleAddBtn = true;
        this.visibleDeleteBtn = false;
      }
      else {
        this.scheduleFields[this.counter] = false
        this.visibleAddBtn = true;
        this.visibleDeleteBtn = false;
      }

    }
    // console.log(this.scheduleFields)
    // console.log(this.counter)
  }

  onEditSchedule(schedcode: number, angForm: any) {
    console.log(angForm.value)
    if(confirm('Are you sure you want to edit this schedule?')) {
      angForm.get('day1').setValue(angForm.get('day1').value.toUpperCase());
      angForm.get('room1').setValue(angForm.get('room1').value.toUpperCase());
      angForm.get('day2').setValue(angForm.get('day2').value.toUpperCase());
      angForm.get('room2').setValue(angForm.get('room2').value.toUpperCase());
      angForm.get('day3').setValue(angForm.get('day3').value.toUpperCase());
      angForm.get('room3').setValue(angForm.get('room3').value.toUpperCase());
      angForm.get('room4').setValue(angForm.get('room4').value.toUpperCase());

      this.checkerFunction()

      this.scheduleService.editSchedule(schedcode, angForm.value).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message)
          this.router.navigate([`schedule/${schedcode}`])
        }
      })
    }


  }

  checkerFunction() {
    if(this.angForm.get('timein1').value != 'N/A') {
      this.scheduleCheckers[0] = 'Y'
      this.angForm.get('ok1').setValue(this.scheduleCheckers[0])
    }
    else {
      this.angForm.get('ok1').setValue(this.scheduleCheckers[0])
    }

    if(this.angForm.get('timein2').value != 'N/A') {
      this.scheduleCheckers[1] = 'Y'
      this.angForm.get('ok2').setValue(this.scheduleCheckers[1])
      this.scheduleFields[0] = true
    }
    else {
      this.angForm.get('ok2').setValue(this.scheduleCheckers[1])
    }

    if(this.angForm.get('timein3').value != 'N/A') {
      this.scheduleCheckers[2] = 'Y'
      this.angForm.get('ok3').setValue(this.scheduleCheckers[2])
      this.scheduleFields[1] = true
    }
    else {
      this.angForm.get('ok3').setValue(this.scheduleCheckers[2])
    }

    if(this.angForm.get('timein4').value != 'N/A') {
      this.scheduleCheckers[3] = 'Y'
      this.angForm.get('ok4').setValue(this.scheduleCheckers[3])
      this.scheduleFields[2] = true
    }
    else {
      this.angForm.get('ok4').setValue(this.scheduleCheckers[3])
    }
  }

  numberFilter(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
