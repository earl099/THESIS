import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-changing',
  templateUrl: './changing.component.html',
  styleUrls: ['./changing.component.scss']
})

export class ChangingComponent implements OnInit {
  processData: any

  //GLOBAL VARIABLE
  globalVar: any
  date = new Date()

  //SEARCHFORM AND VISIBILITY FOR CHANGING OF SUBJECTS
  searchForm: any
  searchVisibility: boolean = true

  //RESULTFORM AND VISIBILITY FOR CHANGING OF SUBJECTS
  resultVisibility: boolean = false

  //ADDING VARIABLES
  scheduleList: Array<any> = []
  filteredSched!: Observable<any>
  schedControl = new FormControl('0')
  addedResultForm: any
  addedScheduleList: Array<any> = []

  //DROPPING VARIABLES
  subjEnrolledData: Array<any> = []
  subjToDrop: Array<any> = []
  dataSource!: MatTableDataSource<any>
  columns: string[] = [
    'schedcode',
    'subjectCode',
    'semester',
    'schoolyear',
    'drop'
  ]

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private enrollmentService: EnrollmentService,
    private scheduleService: ScheduleService,
    private studentService: StudentService,
    private variableService: VariableService
  ) {
    this.filteredSched = this.schedControl.valueChanges.pipe(
      startWith(''),
      map(sched => (sched ? this._filterSched(sched) : this.scheduleList.slice()))
    )
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
        this.searchForm.get('semester').setValue(this.globalVar[0].semester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
      }
    })

    this.addedResultForm = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value:'', disabled: false }),
      isShown: new FormControl({ value: 'true', disabled: false }),
      isTextResult: new FormControl({ value: 'false', disabled: false })
    })

    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })
  }

  generateData() {
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
          this.resultVisibility = true
          this.searchVisibility = false
          //DROPPING PART
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
                    let isDropped = { isChecked: false, index: i }
                    let tmpData = Object.assign(scheduleData, isDropped)
                    if(this.subjEnrolledData.length == null) {
                      this.subjEnrolledData.fill(tmpData, -1)
                    }
                    else {
                      this.subjEnrolledData.push(tmpData)
                    }

                    if(i == schedcode.length - 1) {
                      this.dataSource = new MatTableDataSource(this.subjEnrolledData)
                      console.log(this.subjEnrolledData)

                      //ADDING PART
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
        }
      })
    }
  }

  addSubject() {
    if(this.schedControl.value != undefined || this.schedControl.value == ''){
      if(this.addedResultForm.get('isShown').value == false || this.addedScheduleList.length == 0){
        this.schedControl.reset()
        this.addedResultForm.get('schedcode').setValue('')
        this.addedResultForm.get('subjectCode').setValue('')
        this.addedResultForm.get('isShown').setValue(true)
        this.addedResultForm.get('isTextResult').setValue(false)
        this.addedScheduleList.push(this.addedResultForm.value)
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

  addToDropSubjList(event: MatCheckboxChange, data: any) {
    //ADDING TO SUBJTODROP
    data.isChecked = event.checked

    let studentnumber = this.searchForm.get('studentnumber').value
    let schedcode = data.schedcode
    let edate = String(
      this.date.getFullYear() + '-' +
      (this.date.getMonth() + 1) + '-' +
      this.date.getDate() + ' ' +
      this.date.getHours() + ':' +
      this.date.getMinutes() + ':' +
      this.date.getSeconds())
    let semester = this.searchForm.get('semester').value
    let schoolyear = this.searchForm.get('schoolyear').value
    let isChecked = data.isChecked
    let index = data.index

    const tmpData3 = {
      studentnumber: studentnumber,
      schedcode: schedcode,
      edate: edate,
      semester: semester,
      schoolyear: schoolyear,
      isChecked: isChecked,
      index: index
    }

    if(data.isChecked == true) {
      if(this.subjToDrop.length < 1) {
        this.subjToDrop.unshift(tmpData3)
      }
      else {
        this.subjToDrop.push(tmpData3)
      }
      console.log('Added')
      console.log(this.subjToDrop)
    }
    else {
      if(this.subjToDrop.length < 2) {
        this.subjToDrop.shift()
      }
      else {
        for (let i = 0; i < this.subjToDrop.length; i++) {
          if(data.index == this.subjToDrop[i].index) {
            this.subjToDrop.splice(i, 1)
            break
          }
        }
      }
      //console.log('Removed')
      console.log(this.subjToDrop)
    }
  }


  searchAndAdd(schedcode: any) {
    try {
      this.scheduleService.getSchedule(schedcode).subscribe((res) => {
        if(res) {
          this.addedResultForm.get('schedcode').setValue(res.schedule.schedcode)
          this.addedResultForm.get('subjectCode').setValue(res.schedule.subjectCode)
          this.addedResultForm.get('isShown').setValue(false)
          this.addedResultForm.get('isTextResult').setValue(true)

          if(this.addedScheduleList.length <= 1) {

            this.addedScheduleList.fill(
              {
                studentnumber: this.searchForm.get('studentnumber').value,
                schedcode: this.addedResultForm.get('schedcode').value,
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
                subjectCode: this.addedResultForm.get('subjectCode').value,
                subjNum: this.addedScheduleList.length
              }
            )
          }
          else {
            this.addedScheduleList.push({
              studentnumber: this.searchForm.get('studentnumber').value,
              schedcode: this.addedResultForm.get('schedcode').value,
              edate: String(
                this.date.getFullYear() + '-' +
                (this.date.getMonth() + 1) + '-' +
                this.date.getDate() + ' ' +
                this.date.getHours() + ':' +
                this.date.getMinutes() + ':' +
                this.date.getSeconds()),
              semester: this.searchForm.get('semester').value,
              schoolyear: this.searchForm.get('schoolyear').value,
              isShown: this.addedResultForm.get('isShown').value,
              isTextResult: this.addedResultForm.get('isTextResult').value,
              subjectCode: this.addedResultForm.get('subjectCode').value,
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

  reevaluateFee() {
    if(this.addedScheduleList.length < 1) {
      this.toastr.error('Please add a subject.')
    }
    else if(!this.addedResultForm.get('isShown').value && this.addedScheduleList.length < 1) {
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
            let studnum = this.searchForm.get('studentnumber').value
            let json = JSON.parse(JSON.stringify(this.addedScheduleList[i]))
            console.log(json)
            this.enrollmentService.addSubjTransaction(
              this.searchForm.get('studentnumber').value,
              this.searchForm.get('semester').value,
              this.searchForm.get('schoolyear').value,
              json
            ).subscribe((res) => {
              if(res) {
                if(this.subjToDrop.length < 1) {
                  this.toastr.error('Must Drop a Subject to continue.')
                }
                else {
                  for (let j = 0; j < this.subjToDrop.length; j++) {
                    this.enrollmentService.dropSubjTransaction(
                      this.searchForm.get('studentnumber').value,
                      this.searchForm.get('semester').value,
                      this.searchForm.get('schoolyear').value,
                      this.subjToDrop[j]
                    ).subscribe((res) => {
                      if(res) {
                        if(i == this.addedScheduleList.length - 1 && j == this.subjToDrop.length - 1) {
                          //--- ADD LOG TO DB ---//
                          this.variableService.getIpAddress().subscribe((res) => {
                            if(res) {
                              let ipAdd = res.clientIp

                              this.processData.get('username').setValue(localStorage.getItem('user'))
                              this.processData.get('ipaddress').setValue(ipAdd)
                              this.processData.get('pcname').setValue(window.location.hostname)
                              this.processData.get('studentnumber').setValue(studnum)
                              this.processData.get('type').setValue('Change Subject')
                              this.processData.get('description').setValue(`Changed ${studnum}'s schedule.`)
                              this.variableService.addProcess(this.processData.value).subscribe()
                            }
                            this.toastr.success('Changing of Subjects Success')
                            this.backToSearch()
                          })


                        }
                      }
                    })
                  }
                }
              }
            })
          }
          catch (error) {
            this.toastr.error('Error Reevaluating Fees')
          }
        }
      }
    }


  }


  backToSearch() {
    this.resultVisibility = false
    this.searchVisibility = true
    this.searchForm.get('studentnumber').setValue('')
    this.schedControl.reset()
    this.scheduleList.splice(0, this.scheduleList.length)
    this.addedScheduleList.splice(0, this.addedScheduleList.length)
    this.subjEnrolledData.splice(0, this.subjEnrolledData.length)
    this.subjToDrop.splice(0, this.subjToDrop.length)
    window.location.reload()
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
