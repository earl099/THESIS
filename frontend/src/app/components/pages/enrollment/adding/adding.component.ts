import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
  subjEnrolledData: Array<any> = []

  //SCHEDULES LIST FOR ADDING SUBJECTS
  addedSchedule: any
  addedScheduleList: Array<any> = []

  //VARIABLES FOR ADDING STUDENT
  resultVisibility: boolean = false
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
    //INITIALIZING SEARCHFORM OBJECT
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    //SETTING THE DEFAULT VALUE OF SEMESTER AND SCHOOL
    this.variableService.getLegend().subscribe((res) => {
      if(res){
        this.globalVar = res.legend
        this.searchForm.get('studentnumber').setValue('')
        this.searchForm.get('semester').setValue(this.globalVar[0].semester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
      }

    })

    //INITIALIZING ADDED SUBJECTS FOR DISPLAYING DATA
    this.addedSchedule = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value:'', disabled: false }),
      isShown: new FormControl({ value: true, disabled: false }),
      isTextResult: new FormControl({ value: false, disabled: false })
    })
  }

  generateScheduleList() {
    //SETTING VALUES FOR SCHEDULE DATA AND PUSHING IT TO SCHEDULE LIST
    if(
      this.searchForm.get('studentnumber').value == null ||
      this.searchForm.get('studentnumber').value == ''
    ) {
      this.toastr.error('Enter a Student Number.')
    }
    else {
      this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.scheduleService.getScheduleBySemSY(
            this.searchForm.get('semester').value,
            this.searchForm.get('schoolyear').value
          )
          .subscribe((res) => {
            if(res) {
              this.resultVisibility = true
              this.searchVisibility = false
              this.enrollmentService.getSubjsEnrolled(
                this.searchForm.get('studentnumber').value,
                this.searchForm.get('semester').value,
                this.searchForm.get('schoolyear').value
              ).subscribe((res) => {
                if(res) {
                  let schedcode = res.subjsEnrolled
                  for (let i = 0; i < schedcode.length; i++) {
                    this.scheduleService.getSchedule(schedcode[i].schedcode).subscribe((res) => {
                      if(res) {
                        let scheduleData = res.schedule
                        if(this.subjEnrolledData.length == null) {
                          this.subjEnrolledData.fill(scheduleData, -1)
                        }
                        else {
                          this.subjEnrolledData.push(scheduleData)
                        }

                        if(i == schedcode.length - 1) {
                          //FILTER THE ENROLLED SUBJECTS
                          this.scheduleService.getScheduleBySemSY(
                            this.searchForm.get('semester').value,
                            this.searchForm.get('schoolyear').value
                          )
                          .subscribe((res) => {
                            if(res) {
                              let tmpData2 = res.schedule
                              let enrolled = false
                              for(let i = 0; i < tmpData2.length; i++) {
                                for (let j = 0; j < this.subjEnrolledData.length; j++) {
                                  enrolled = false
                                  if(this.subjEnrolledData[j].schedcode == tmpData2[i].schedcode) {
                                    enrolled = true
                                    break
                                  }
                                }
                                if(enrolled) {
                                  continue
                                }
                                else {
                                  this.scheduleList.push(tmpData2[i])
                                }
                              }
                              console.log(this.scheduleList)
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
              //console.log(this.scheduleList)
            }
          })
        }
      })

    }

  }

  //FUNCTION FOR SEARCHING AND ADDING TO ADDED SCHEDULE FORMARRAY
  addSubject() {
    if(this.schedControl.value != undefined || this.schedControl.value == ''){
      if(this.addedSchedule.get('isShown').value == false || this.addedScheduleList.length == 0){
        this.schedControl.reset()
        this.addedSchedule.get('schedcode').setValue('')
        this.addedSchedule.get('subjectCode').setValue('')
        this.addedSchedule.get('isShown').setValue(true)
        this.addedSchedule.get('isTextResult').setValue(false)
        this.addedScheduleList.push(this.addedSchedule.value)
        console.log(this.addedScheduleList)
      }
      else {
        this.toastr.error('Please press Search before adding another subject.')
      }
    }
    else {
      this.toastr.error('Add a subject first.')
    }
  }


  searchAndAdd(schedcode: any) {
    try {
      this.scheduleService.getSchedule(schedcode).subscribe((res) => {
        if(res) {
          this.addedSchedule.get('schedcode').setValue(res.schedule.schedcode)
          this.addedSchedule.get('subjectCode').setValue(res.schedule.subjectCode)
          this.addedSchedule.get('isShown').setValue(false)
          this.addedSchedule.get('isTextResult').setValue(true)

          if(this.addedScheduleList.length <= 1) {

            this.addedScheduleList.fill(
              {
                studentnumber: this.searchForm.get('studentnumber').value,
                schedcode: this.addedSchedule.get('schedcode').value,
                edate: String(
                  this.date.getFullYear() + '-' +
                  (this.date.getMonth() + 1) + '-' +
                  this.date.getDate() + ' ' +
                  this.date.getHours() + ':' +
                  this.date.getMinutes() + ':' +
                  this.date.getSeconds()),
                semester: this.searchForm.get('semester').value,
                schoolyear: this.searchForm.get('schoolyear').value,
                isShown: false,
                isTextResult: true,
                subjectCode: this.addedSchedule.get('subjectCode').value,
                subjNum: this.addedScheduleList.length
              }
            )
          }
          else {
            this.addedScheduleList.push({
              studentnumber: this.searchForm.get('studentnumber').value,
              schedcode: this.addedSchedule.get('schedcode').value,
              edate: String(
                this.date.getFullYear() + '-' +
                (this.date.getMonth() + 1) + '-' +
                this.date.getDate() + ' ' +
                this.date.getHours() + ':' +
                this.date.getMinutes() + ':' +
                this.date.getSeconds()),
              semester: this.searchForm.get('semester').value,
              schoolyear: this.searchForm.get('schoolyear').value,
              isShown: this.addedSchedule.get('isShown').value,
              isTextResult: this.addedSchedule.get('isTextResult').value,
              subjectCode: this.addedSchedule.get('subjectCode').value,
              subjNum: this.addedScheduleList.length
            })
            for (let i = 0; i < this.addedScheduleList.length; i++) {
              if(this.addedScheduleList[i].schedcode == '') {
                this.addedScheduleList.splice(i, 1)
              }

            }

          }

          console.log(this.addedScheduleList)
        }
      })
      //console.log(schedcode)
    } catch (error) {
      console.log(error)
    }

  }

  //FUNCTION FOR FINALIZING ADDED SCHEDULES
  finalAdd() {
    if(this.addedScheduleList.length < 1) {
      this.toastr.error('Please add a subject.')
    }
    else if(!this.addedSchedule.get('isShown').value && this.addedScheduleList.length < 1) {
      this.toastr.error('All Subjects must be searched before reevaluation.')
    }
    else {
      for (let i = 0; i < this.addedScheduleList.length; i++) {
        if(!this.addedScheduleList[i].isTextResult) {
          this.toastr.error('All Subjects must be searched.')
          break
        }
        else {
          try{
            let json = JSON.parse(JSON.stringify(this.addedScheduleList[i]))
            console.log(json)
            this.enrollmentService.addSubjTransaction(
              this.searchForm.get('studentnumber').value,
              this.searchForm.get('semester').value,
              this.searchForm.get('schoolyear').value,
              json
            ).subscribe()
            this.toastr.success('Added Subject/s Successfully.')
          }
          catch (error) {
            this.toastr.error('Error Adding Subject')
          }

        }
      }
      this.backToSearch()
    }
  }

  backToSearch() {
    this.resultVisibility = false
    this.searchVisibility = true
    this.searchForm.get('studentnumber').setValue('')
    this.schedControl.reset()
    this.scheduleList.splice(0, this.scheduleList.length)
    this.addedScheduleList.splice(0, this.addedScheduleList.length)
    //console.log(this.scheduleList)
  }

  //FOR FILTERING THE SCHEDCODE
  private _filterSched(value: string): any[] {
    const filterValue = value.toLowerCase()
    return this.scheduleList.filter(sched => sched.schedcode.toLowerCase().includes(filterValue))
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
