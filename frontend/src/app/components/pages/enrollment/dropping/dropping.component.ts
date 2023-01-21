import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-dropping',
  templateUrl: './dropping.component.html',
  styleUrls: ['./dropping.component.scss']
})
export class DroppingComponent implements OnInit {
  //VARIABLE FOR DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
  globalVar: any

  //VARIABLES FOR SEARCH AND ITS VISIBILITY
  searchForm: any
  searchVisibility: boolean = true

  //VARIABLES FOR RESULTS AND ITS VISIBILITY
  columns: string[] = [
    'schedcode',
    'subjectCode',
    'semester',
    'schoolyear',
    'drop'
  ]
  resultDataSource!: MatTableDataSource<any>
  resultVisibility: boolean = false
  subjEnrolledData: Array<any> = []

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private enrollmentService: EnrollmentService,
    private scheduleService: ScheduleService,
    private studentService: StudentService,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    //INITIALIZING SEARCHFORM
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    //SETTING THE DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
        this.searchForm.get('semester').setValue(this.globalVar[0].semester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
      }
    })
  }

  generateData() {
    if(this.searchForm.get('studentnumber').value == null || this.searchForm.get('studentnumber').value == '') {
      this.toastr.error('Please enter a Student Number.')
    }
    else {
      this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.enrollmentService.getSubjsEnrolled(
            this.searchForm.get('studentnumber').value,
            this.searchForm.get('semester').value,
            this.searchForm.get('schoolyear').value
          ).subscribe((res) => {
            if(res) {
              let schedcode = res.subjsEnrolled
              for (let i = 0; i < schedcode.length; i++) {
                this.scheduleService.getSchedule(schedcode[i].schedcode).subscribe((res) => {
                  this.searchVisibility = false
                  this.resultVisibility = true
                  let scheduleData = res.schedule

                  if(this.subjEnrolledData.length == null) {
                    this.subjEnrolledData.fill(scheduleData, -1)
                  }
                  else {
                    this.subjEnrolledData.push(scheduleData)
                  }

                  if(i == schedcode.length - 1) {
                    this.resultDataSource = new MatTableDataSource(this.subjEnrolledData)
                  }
                })
              }
            }
          })
        }
      })
    }
  }

  dropSubj(data: any) {
    //initialize drop
    if(confirm('Are you sure you want to delete this subject and reevaluate')) {
      this.enrollmentService.dropSubjTransaction(
        this.searchForm.get('studentnumber').value,
        this.searchForm.get('semester').value,
        this.searchForm.get('schoolyear').value,
        data
      ).subscribe((res) => {
        if(res) {
          this.toastr.success('Subject Dropped.')
          this.backToSearch()
        }
      })
    }
  }

  backToSearch() {
    this.searchVisibility = true
    this.resultVisibility = false
    this.searchForm.get('studentnumber').setValue('')
    this.subjEnrolledData.splice(0, this.subjEnrolledData.length)
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
