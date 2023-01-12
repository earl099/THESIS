import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.scss']
})
export class AddingComponent implements OnInit {
  //VARIABLE FOR DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
  globalVar: any

  //VARIABLES FOR SEARCH AND ITS VISIBILITY
  searchForm: any
  searchVisibility: boolean = true

  //SCHEDULE LIST
  schedControl = new FormControl('0')
  filteredSched!: Observable<any>
  scheduleList: Array<any> = []

  //SCHEDULES LIST FOR ADDING SUBJECTS
  addedSchedule: any
  addedScheduleList: Array<any> = []

  //VARIABLES FOR ADDING STUDENT
  resultForm: any
  resultVisibility: boolean = false
  totalAmount: number = 0
  pTotalAmount: number = 0
  date = new Date()

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private scheduleService: ScheduleService,
    private variableService: VariableService
  ) {
    this.filteredSched = this.schedControl.valueChanges.pipe(
      startWith(''),
      map(sched => (sched ? this._filterSched(sched) : this.scheduleList.slice()))
    )
  }

  ngOnInit(): void {
  }

}
