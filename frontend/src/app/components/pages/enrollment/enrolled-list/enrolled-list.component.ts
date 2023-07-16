import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { GradesService } from 'src/app/services/grades.service';
import { ReportService } from 'src/app/services/report.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';

export interface DialogData {
  studentnumber: any
}

@Component({
  selector: 'app-enrolled-list',
  templateUrl: './enrolled-list.component.html',
  styleUrls: ['./enrolled-list.component.scss']
})
export class EnrolledListComponent implements OnInit {
  pageStyle: any
  globalVar: any

  processData: any
  courseList: any = []

  columns: string[] = [
    'studentnumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'action',
    'confirm'
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  enrolledList: any[] = []
  dataSource!: MatTableDataSource<any>
  isAddOpen: boolean = false
  isDropOpen: boolean = false
  isChangeOpen: boolean = false
  isRegFormOpen: boolean = false
  isCogOpen: boolean = false
  operationData: any


  // --- ADDING VARIABLES ---//
  //SCHEDULE LIST
  schedControl = new FormControl('0')
  filteredSched!: Observable<any>
  scheduleList: Array<any> = []
  subjEnrolledData: Array<any> = []

  //SCHEDULES LIST FOR ADDING SUBJECTS
  addedSchedule: any
  addedScheduleList: Array<any> = []

  //VARIABLES FOR ADDING STUDENT
  date = new Date()

  //--- DROPPING VARIABLES ---//
  //VARIABLES FOR RESULTS AND ITS VISIBILITY
  dropColumns: string[] = [
    'schedcode',
    'subjectCode',
    'semester',
    'schoolyear',
    'drop'
  ]

  resultDataSource!: MatTableDataSource<any>

  //--- CHANGING VARIABLES ---//
  addedResultForm: any
  subjToDrop: Array<any> = []

  //--- REGFORM VARIABLES ---//
  //--- STUDENT INFO AND DIVISION OF FEES DATA ---//
  resultForm: any
  currentDate = Date.now()

  //--- SUBJECTS TABLE DATA ---//
  resultSubjectsList: any
  totalUnits: number = 0
  totalHours: number = 0
  totalAmount: number = 0
  resultSubjectsColumn: string[] = [
    'schedcode',
    'subjectcode',
    'subjectTitle',
    'units',
    'time',
    'day',
    'room'
  ]
  regFormDataSource!: MatTableDataSource<any>

  @ViewChild('print') print!: ElementRef

  //--- EXPORT COG VARIABLES ---//
  cogSemester = new FormControl('')
  cogSchoolyear = new FormControl('')

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
    private variableService: VariableService,
    private userService: UserService,
    private reportService: ReportService,
    private studentService: StudentService,
    private scheduleService: ScheduleService,
    private enrollmentService: EnrollmentService
  ) {
    this.filteredSched = this.schedControl.valueChanges.pipe(
      startWith(''),
      map(sched => (sched ? this._filterSched(sched) : this.scheduleList.slice()))
    )
  }

  ngOnInit(): void {
    //INITIALIZING OPERATION DATA KEY-PAIR VALUES
    this.operationData = this.fb.group({
      type: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false })
    })

    //INITIALIZING ADDED SUBJECTS FOR DISPLAYING DATA
    this.addedSchedule = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value:'', disabled: false }),
      isShown: new FormControl({ value: true, disabled: false }),
      isTextResult: new FormControl({ value: false, disabled: false })
    })

    this.addedResultForm = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value:'', disabled: false }),
      isShown: new FormControl({ value: 'true', disabled: false }),
      isTextResult: new FormControl({ value: 'false', disabled: false })
    })

    this.resultForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false }),
      major:  new FormControl({ value: '', disabled: false }),
      year:  new FormControl({ value: '', disabled: false }),
      address:  new FormControl({ value: '', disabled: false }),
      section:  new FormControl({ value: '', disabled: false }),
      scholarship: new FormControl({ value: '', disabled: false }),
      discountSrf: new FormControl({ value: '', disabled: false }),
      discountSfdf: new FormControl({ value: '', disabled: false }),
      discountTuition: new FormControl({ value: '', disabled: false }),
      ansci: new FormControl({ value: '', disabled: false }),
      biosci: new FormControl({ value: '', disabled: false }),
      cemds: new FormControl({ value: '', disabled: false }),
      hrm: new FormControl({ value: '', disabled: false }),
      cropsci: new FormControl({ value: '', disabled: false }),
      engineering: new FormControl({ value: '', disabled: false }),
      physci: new FormControl({ value: '', disabled: false }),
      vetmed: new FormControl({ value: '', disabled: false }),
      speech: new FormControl({ value: '', disabled: false }),
      english: new FormControl({ value: '', disabled: false }),
      nursing: new FormControl({ value: '', disabled: false }),
      ccl: new FormControl({ value: '', disabled: false }),
      rle: new FormControl({ value: '', disabled: false }),
      internet: new FormControl({ value: '', disabled: false }),
      nstp: new FormControl({ value: '', disabled: false }),
      ojt: new FormControl({ value: '', disabled: false }),
      thesis: new FormControl({ value: '', disabled: false }),
      student: new FormControl({ value: '', disabled: false }),
      late: new FormControl({ value: '', disabled: false }),
      residency: new FormControl({ value: '', disabled: false }),
      foreignstudent: new FormControl({ value: '', disabled: false }),
      addedsubj: new FormControl({ value: '', disabled: false }),
      petition: new FormControl({ value: '', disabled: false }),
      tuition: new FormControl({ value: '', disabled: false }),
      library: new FormControl({ value: '', disabled: false }),
      medical: new FormControl({ value: '', disabled: false }),
      publication: new FormControl({ value: '', disabled: false }),
      registration: new FormControl({ value: '', disabled: false }),
      guidance: new FormControl({ value: '', disabled: false }),
      id: new FormControl({ value: '', disabled: false }),
      sfdf: new FormControl({ value: '', disabled: false }),
      srf: new FormControl({ value: '', disabled: false }),
      athletic: new FormControl({ value: '', disabled: false }),
      scuaa: new FormControl({ value: '', disabled: false }),
      deposit: new FormControl({ value: '', disabled: false }),
      cspear: new FormControl({ value: '', disabled: false }),
      edfs: new FormControl({ value: '', disabled: false }),
      psyc: new FormControl({ value: '', disabled: false }),
      trm: new FormControl({ value: '', disabled: false }),
      fishery: new FormControl({ value: '', disabled: false }),
      totalLab: new FormControl({ value: '', disabled: false }),
      totalOther: new FormControl({ value: '', disabled: false })
    })

    //process log data
    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })

    this.initData()
  }

  //--- INITIALIZING DATA STARTS HERE ---//
  initData() {
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
        this.cogSemester.setValue(this.globalVar[0].ksemester)
        this.cogSchoolyear.setValue(this.globalVar[0].kschoolyear)

        this.enrollmentService.getStudsEnroll(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            let tmpData = res.studsEnroll

            for (let i = 0; i < tmpData.length; i++) {
              this.studentService.getStudent(tmpData[i].studentnumber).subscribe((res) => {
                if(res) {
                  let tmpData2 = res.student

                  let finalTmpData = {}

                  this.enrolledList.push(Object.assign(
                    finalTmpData,
                    {
                      studentnumber: tmpData[i].studentnumber,
                      firstName: tmpData2.firstName,
                      middleName: tmpData2.middleName,
                      lastName: tmpData2.lastName,
                      suffix: tmpData2.suffix,
                      course: tmpData2.course
                    })
                  )

                  if(i == tmpData.length - 1) {
                    this.dataSource = new MatTableDataSource(this.enrolledList)
                  }
                }
              })
            }

            let check = this.userService.getToken()

            if(check != 'UNIV') {
              this.reportService.getCourses(check).subscribe((res) => {
                if(res) {
                  this.courseList = res.course
                  //console.log(this.courseList)
                }
              })
            }
            else {
              this.reportService.getCourses('ALL').subscribe((res) => {
                if(res) {
                  this.courseList = res.course
                  //console.log(this.courseList)
                }
              })
            }

          }
        })
      }
    })

  }

  setOperation(value: any) {
    this.operationData.get('type').setValue(value)
  }

  //--- TABLE BUTTON STARTS HERE ---//
  showOperation(operation: any, studentnumber: any) {
    this.operationData.get('studentnumber').setValue(studentnumber)
    console.log(operation)
    switch (operation) {
      case 'ADD':
        this.isAddOpen = true
        this.generateScheduleList()
        break;

      case 'DROP':
        this.isDropOpen = true
        this.generateData()
        break

      case 'CHANGE':
        this.generateChangeData()
        this.isChangeOpen = true
        break

      case 'REGFORM':
        this.generateRegForm()
        this.isRegFormOpen = true
        this.pageStyle = '20rem'
        break

      case 'COG':
        this.openDialog(studentnumber)
        this.isCogOpen = true
        break

      default:
        break;
    }

  }

  //--- COURSE CHECKING STARTS HERE ---//
  courseCheck(course: any) {
    return !this.courseList.find((item: any) => item.courseCode === course)
  }

  //--- ADDING SECTION STARTS HERE ---//
  generateScheduleList() {
    //SETTING VALUES FOR SCHEDULE DATA AND PUSHING IT TO SCHEDULE LIST
    this.studentService.getStudent(this.operationData.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.scheduleService.getSchedulesBySemSY(
          this.globalVar[0].semester,
          this.globalVar[0].schoolyear
        )
        .subscribe((res) => {
          if(res) {
            this.enrollmentService.getSubjsEnrolled(
              this.operationData.get('studentnumber').value,
              this.globalVar[0].semester,
              this.globalVar[0].schoolyear
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
                        this.scheduleService.getSchedulesBySemSY(
                          this.globalVar[0].semester,
                          this.globalVar[0].schoolyear
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

  //FUNCTION FOR SEARCHING AND ADDING TO ADDED SCHEDULE FORM
  addSubject() {
    if(this.schedControl.value != undefined || this.schedControl.value == ''){
      if(this.addedSchedule.get('isShown').value == false || this.addedScheduleList.length == 0){
        this.schedControl.reset()
        this.addedSchedule.get('schedcode').setValue('')
        this.addedSchedule.get('subjectCode').setValue('')
        this.addedSchedule.get('isShown').setValue(true)
        this.addedSchedule.get('isTextResult').setValue(false)
        this.addedScheduleList.push(this.addedSchedule.value)
        //console.log(this.addedScheduleList)
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
                studentnumber: this.operationData.get('studentnumber').value,
                schedcode: this.addedSchedule.get('schedcode').value,
                edate: String(
                  this.date.getFullYear() + '-' +
                  (this.date.getMonth() + 1) + '-' +
                  this.date.getDate() + ' ' +
                  this.date.getHours() + ':' +
                  this.date.getMinutes() + ':' +
                  this.date.getSeconds()),
                semester: this.globalVar[0].semester,
                schoolyear: this.globalVar[0].schoolyear,
                isShown: false,
                isTextResult: true,
                subjectCode: this.addedSchedule.get('subjectCode').value,
                subjNum: this.addedScheduleList.length
              }
            )
          }
          else {
            this.addedScheduleList.push({
              studentnumber: this.operationData.get('studentnumber').value,
              schedcode: this.addedSchedule.get('schedcode').value,
              edate: String(
                this.date.getFullYear() + '-' +
                (this.date.getMonth() + 1) + '-' +
                this.date.getDate() + ' ' +
                this.date.getHours() + ':' +
                this.date.getMinutes() + ':' +
                this.date.getSeconds()),
              semester: this.globalVar[0].semester,
              schoolyear: this.globalVar[0].schoolyear,
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
            if (confirm('Are you sure you want to add the subject/s to the student\'s schedule?')) {
              let json = JSON.parse(JSON.stringify(this.addedScheduleList[i]))
              console.log(json)
              this.enrollmentService.addSubjTransaction(
                this.operationData.get('studentnumber').value,
                this.globalVar[0].semester,
                this.globalVar[0].schoolyear,
                json
              ).subscribe((res) => {
                if(res) {
                  let studnum = this.operationData.get('studentnumber').value
                  this.variableService.getIpAddress().subscribe((res) => {
                    if(res) {
                      for (let i = 0; i < this.addedScheduleList.length; i++) {
                        let ipAdd = res.clientIp

                        this.processData.get('username').setValue(localStorage.getItem('user'))
                        this.processData.get('ipaddress').setValue(ipAdd)
                        this.processData.get('pcname').setValue(window.location.hostname)
                        this.processData.get('studentnumber').setValue(studnum)
                        this.processData.get('type').setValue('Add Subject')
                        this.processData.get('description').setValue(
                          `Added ${this.addedScheduleList[i].schedcode} to ${studnum}'s schedule.`
                        )
                        this.variableService.addProcess(this.processData.value).subscribe()
                        this.closeSection()
                      }

                    }
                  })
                }
              })
              this.toastr.success('Added Subject/s Successfully.')
            }

          }
          catch (error) {
            this.toastr.error('Error Adding Subject')
          }

        }
      }
    }
  }


  //--- DROPPING SECTION STARTS HERE ---//
  generateData() {
    this.studentService.getStudent(this.operationData.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.enrollmentService.getSubjsEnrolled(
          this.operationData.get('studentnumber').value,
          this.globalVar[0].semester,
          this.globalVar[0].schoolyear
        ).subscribe((res) => {
          if(res) {
            let schedcode = res.subjsEnrolled
            for (let i = 0; i < schedcode.length; i++) {
              this.scheduleService.getSchedule(schedcode[i].schedcode).subscribe((res) => {
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

  dropSubj(data: any) {
    //initialize drop
    let studnum = this.operationData.get('studentnumber').value

    if(confirm('Are you sure you want to delete this subject and reevaluate')) {
      this.enrollmentService.dropSubjTransaction(
        this.operationData.get('studentnumber').value,
        this.globalVar[0].semester,
        this.globalVar[0].schoolyear,
        data
      ).subscribe((res) => {
        if(res) {
          this.variableService.getIpAddress().subscribe((res) => {
            if(res) {
              let ipAdd = res.clientIp

              this.processData.get('username').setValue(localStorage.getItem('user'))
              this.processData.get('ipaddress').setValue(ipAdd)
              this.processData.get('pcname').setValue(window.location.hostname)
              this.processData.get('studentnumber').setValue(studnum)
              this.processData.get('type').setValue('Drop Subject')
              this.processData.get('description').setValue(`Dropped ${data.schedcode} to ${studnum}'s schedule.`)
              this.variableService.addProcess(this.processData.value).subscribe()
            }
          })

          this.toastr.success('Subject Dropped.')

        }
      })
    }
    this.closeSection()
  }

  //--- CHANGING SECTION STARTS HERE ---//
  generateChangeData() {
    //SETTING VALUES FOR SCHEDULE DATA AND PUSHING IT TO SCHEDULE LIST
    this.studentService.getStudent(this.operationData.get('studentnumber').value).subscribe((res) => {
      if(res) {
        //DROPPING PART
        this.enrollmentService.getSubjsEnrolled(
          this.operationData.get('studentnumber').value,
          this.globalVar[0].semester,
          this.globalVar[0].schoolyear,
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
                    this.resultDataSource = new MatTableDataSource(this.subjEnrolledData)
                    console.log(this.subjEnrolledData)

                    //ADDING PART
                    this.scheduleService.getSchedulesBySemSY(
                      this.globalVar[0].semester,
                      this.globalVar[0].schoolyear
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

  addToDropSubjList(event: MatCheckboxChange, data: any) {
    //ADDING TO SUBJTODROP
    data.isChecked = event.checked

    let studentnumber = this.operationData.get('studentnumber').value
    let schedcode = data.schedcode
    let edate = String(
      this.date.getFullYear() + '-' +
      (this.date.getMonth() + 1) + '-' +
      this.date.getDate() + ' ' +
      this.date.getHours() + ':' +
      this.date.getMinutes() + ':' +
      this.date.getSeconds())
    let semester = this.globalVar[0].semester
    let schoolyear = this.globalVar[0].schoolyear
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
            let studnum = this.operationData.get('studentnumber').value
            let json = JSON.parse(JSON.stringify(this.addedScheduleList[i]))
            console.log(json)
            this.enrollmentService.addSubjTransaction(
              this.operationData.get('studentnumber').value,
              this.globalVar[0].semester,
              this.globalVar[0].schoolyear,
              json
            ).subscribe((res) => {
              if(res) {
                if(this.subjToDrop.length < 1) {
                  this.toastr.error('Must Drop a Subject to continue.')
                }
                else {
                  for (let j = 0; j < this.subjToDrop.length; j++) {
                    this.enrollmentService.dropSubjTransaction(
                      this.operationData.get('studentnumber').value,
                      this.globalVar[0].semester,
                      this.globalVar[0].schoolyear,
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
                            this.closeSection()
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

  //--- REG FORM EXPORT FUNCTION STARTS HERE ---//
  generateRegForm() {
    this.studentService.getStudent(this.operationData.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.resultForm.get('studentnumber').setValue(res.student.studentNumber)
        this.resultForm.get('firstname').setValue(res.student.firstName)
        this.resultForm.get('middlename').setValue(res.student.middleName.charAt(0))
        this.resultForm.get('lastname').setValue(res.student.lastName)
        this.resultForm.get('address').setValue(res.student.street + ', ' + res.student.municipality + ', ' + res.student.province)
      }
    })

    this.enrollmentService.getStudEnroll(
      this.operationData.get('studentnumber').value,
      this.globalVar[0].semester,
      this.globalVar[0].schoolyear
    ).subscribe((res) => {
      this.resultForm.get('course').setValue(res.studEnroll.coursenow)
      this.resultForm.get('major').setValue(res.studEnroll.majorCourse)
      this.resultForm.get('year').setValue(res.studEnroll.yearLevel)
      this.resultForm.get('scholarship').setValue(res.studEnroll.scholarship)

      this.enrollmentService.getScholarshipDetails(this.resultForm.get('scholarship').value).subscribe((res) => {
        this.resultForm.get('discountSrf').setValue(res.scholarshipDetails.srf)
        this.resultForm.get('discountSfdf').setValue(res.scholarshipDetails.sfdf)
        this.resultForm.get('discountTuition').setValue(res.scholarshipDetails.tuition)
        //console.log(this.resultForm.value)
      })
    })



    this.enrollmentService.getDivOfFees(
      this.operationData.get('studentnumber').value,
      this.globalVar[0].semester,
      this.globalVar[0].schoolyear
      ).subscribe((res) => {
        if(res) {
          this.resultForm.get('ansci').setValue(Number.parseFloat(res.divOfFees.ansci))
          this.resultForm.get('biosci').setValue(Number.parseFloat(res.divOfFees.biosci))
          this.resultForm.get('cemds').setValue(Number.parseFloat(res.divOfFees.cemds))
          this.resultForm.get('hrm').setValue(Number.parseFloat(res.divOfFees.hrm))
          this.resultForm.get('cropsci').setValue(Number.parseFloat(res.divOfFees.cropsci))
          this.resultForm.get('engineering').setValue(Number.parseFloat(res.divOfFees.engineering))
          this.resultForm.get('physci').setValue(Number.parseFloat(res.divOfFees.physci))
          this.resultForm.get('vetmed').setValue(Number.parseFloat(res.divOfFees.vetmed))
          this.resultForm.get('speech').setValue(Number.parseFloat(res.divOfFees.speech))
          this.resultForm.get('english').setValue(Number.parseFloat(res.divOfFees.english))
          this.resultForm.get('nursing').setValue(Number.parseFloat(res.divOfFees.nursing))
          this.resultForm.get('ccl').setValue(Number.parseFloat(res.divOfFees.ccl))
          this.resultForm.get('rle').setValue(Number.parseFloat(res.divOfFees.rle))
          this.resultForm.get('internet').setValue(Number.parseFloat(res.divOfFees.internet))
          this.resultForm.get('nstp').setValue(Number.parseFloat(res.divOfFees.nstp))
          this.resultForm.get('ojt').setValue(Number.parseFloat(res.divOfFees.ojt))
          this.resultForm.get('thesis').setValue(Number.parseFloat(res.divOfFees.thesis))
          this.resultForm.get('student').setValue(Number.parseFloat(res.divOfFees.student))
          this.resultForm.get('late').setValue(Number.parseFloat(res.divOfFees.late))
          this.resultForm.get('residency').setValue(Number.parseFloat(res.divOfFees.residency))
          this.resultForm.get('foreignstudent').setValue(Number.parseFloat(res.divOfFees.foreignstudent))
          this.resultForm.get('addedsubj').setValue(Number.parseFloat(res.divOfFees.addedsubj))
          this.resultForm.get('petition').setValue(Number.parseFloat(res.divOfFees.petition))
          this.resultForm.get('tuition').setValue(Number.parseFloat(res.divOfFees.tuition))
          this.resultForm.get('library').setValue(Number.parseFloat(res.divOfFees.library))
          this.resultForm.get('medical').setValue(Number.parseFloat(res.divOfFees.medical))
          this.resultForm.get('publication').setValue(Number.parseFloat(res.divOfFees.publication))
          this.resultForm.get('registration').setValue(Number.parseFloat(res.divOfFees.registration))
          this.resultForm.get('guidance').setValue(Number.parseFloat(res.divOfFees.guidance))
          this.resultForm.get('id').setValue(Number.parseFloat(res.divOfFees.id))
          this.resultForm.get('sfdf').setValue(Number.parseFloat(res.divOfFees.sfdf))
          this.resultForm.get('srf').setValue(Number.parseFloat(res.divOfFees.srf))
          this.resultForm.get('athletic').setValue(Number.parseFloat(res.divOfFees.athletic))
          this.resultForm.get('scuaa').setValue(Number.parseFloat(res.divOfFees.scuaa))
          this.resultForm.get('deposit').setValue(Number.parseFloat(res.divOfFees.deposit))
          this.resultForm.get('cspear').setValue(Number.parseFloat(res.divOfFees.cspear))
          this.resultForm.get('edfs').setValue(Number.parseFloat(res.divOfFees.edfs))
          this.resultForm.get('psyc').setValue(Number.parseFloat(res.divOfFees.psyc))
          this.resultForm.get('trm').setValue(Number.parseFloat(res.divOfFees.trm))
          this.resultForm.get('fishery').setValue(Number.parseFloat(res.divOfFees.fishery))
          this.resultForm.get('totalLab').setValue(
            this.resultForm.get('ansci').value +
            this.resultForm.get('biosci').value +
            this.resultForm.get('cemds').value +
            this.resultForm.get('hrm').value +
            this.resultForm.get('cropsci').value +
            this.resultForm.get('engineering').value +
            this.resultForm.get('physci').value +
            this.resultForm.get('vetmed').value +
            this.resultForm.get('speech').value +
            this.resultForm.get('english').value +
            this.resultForm.get('ccl').value +
            this.resultForm.get('cspear').value +
            this.resultForm.get('fishery').value +
            this.resultForm.get('psyc').value
          )
          this.resultForm.get('totalOther').setValue(
            this.resultForm.get('internet').value +
            this.resultForm.get('nstp').value +
            this.resultForm.get('ojt').value +
            this.resultForm.get('thesis').value +
            this.resultForm.get('rle').value +
            this.resultForm.get('student').value +
            this.resultForm.get('late').value +
            this.resultForm.get('residency').value +
            this.resultForm.get('foreignstudent').value +
            this.resultForm.get('addedsubj').value +
            this.resultForm.get('petition').value
          )

          this.totalAmount += (
            (
              this.resultForm.get('tuition').value -
              (
                this.resultForm.get('tuition').value *
                (
                  this.resultForm.get('discountTuition').value / 100
                )
              )
            ) +
            this.resultForm.get('library').value +
            this.resultForm.get('medical').value +
            this.resultForm.get('publication').value +
            this.resultForm.get('registration').value +
            this.resultForm.get('guidance').value +
            this.resultForm.get('id').value +
            (
              this.resultForm.get('sfdf').value -
              (
                this.resultForm.get('sfdf').value *
                (
                  this.resultForm.get('discountSfdf').value / 100
                )
              )
            ) +
            (
              this.resultForm.get('srf').value -
              (
                this.resultForm.get('srf').value *
                (
                  this.resultForm.get('discountSrf').value / 100
                )
              )
            ) +
            this.resultForm.get('athletic').value +
            this.resultForm.get('scuaa').value +
            this.resultForm.get('deposit').value +
            this.resultForm.get('edfs').value +
            this.resultForm.get('trm').value +
            this.resultForm.get('totalLab').value +
            this.resultForm.get('totalOther').value
          )
        }
      }
    )

    this.enrollmentService.getSubjsEnrolled(
      this.operationData.get('studentnumber').value,
      this.globalVar[0].semester,
      this.globalVar[0].schoolyear
    )
    .subscribe((res) => {
      if(res) {
        this.resultSubjectsList = res.subjsEnrolled
        //console.log(this.resultSubjectsList)
        for(let i = 0; i < this.resultSubjectsList.length; i++) {
          this.scheduleService.getSchedule(
            this.resultSubjectsList[i].schedcode
          )
          .subscribe((res) => {
            let tmpResult: any
            if(res) {
              tmpResult = res.schedule
              this.resultSubjectsList[i] = Object.assign(this.resultSubjectsList[i], tmpResult)
              this.totalUnits += (Number(tmpResult.units) + Number(tmpResult.labunits))
              this.totalHours += Number(tmpResult.oras)
              this.enrollmentService.getSubjectTitle(
                this.resultSubjectsList[i].subjectCode
              )
              .subscribe((res) => {
                let tmpResult2: any
                if(res) {
                  tmpResult2 = res.subject
                  this.resultSubjectsList[i] = Object.assign(this.resultSubjectsList[i], tmpResult2)
                  if(i == this.resultSubjectsList.length - 1) {
                    this.regFormDataSource = new MatTableDataSource(this.resultSubjectsList)
                    //console.log(this.resultSubjectsList)
                    for(let j = 0; j < this.resultSubjectsList.length; j++) {
                      let sectionChecker: boolean = true
                      if(j == 0) {
                        sectionChecker = true
                      }
                      else {
                        if(j != this.resultSubjectsList.length - 1) {
                          if(this.resultSubjectsList[j].section == this.resultSubjectsList[j-1].section) {
                            sectionChecker = true
                          }
                          else {
                            sectionChecker = false
                            this.resultForm.get('section').setValue('IRREGULAR')
                            break
                          }
                        }
                        else {
                          if(sectionChecker == true) {
                            this.resultForm.get('section').setValue(this.resultSubjectsList[j].section)
                          }
                          else {
                            this.resultForm.get('section').setValue('IRREGULAR')
                          }
                        }
                      }
                    }
                  }
                }
              })
            }
          })
        }
      }
    })
  }

  exportRegForm() {
    let data: any = document.getElementById('print')
    html2canvas(data).then((canvas) => {
      let fileWidth = 208
      let fileHeight = (canvas.height * fileWidth) / canvas.width
      const fileURI = canvas.toDataURL('image/jpg')
      let pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0
      let date = new Date(Date.now())
      pdf.addImage(fileURI, 'JPG', 0, position, fileWidth, fileHeight)
      pdf.save( this.resultForm.get('lastname').value + '-regform-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '.pdf')
    })

    //--- ADD LOG TO DB ---//
    this.variableService.getIpAddress().subscribe((res) => {
      if(res) {
        let ipAdd = res.clientIp

        this.processData.get('username').setValue(localStorage.getItem('user'))
        this.processData.get('ipaddress').setValue(ipAdd)
        this.processData.get('pcname').setValue(window.location.hostname)
        this.processData.get('studentnumber').setValue(this.operationData.get('studentnumber').value)
        this.processData.get('type').setValue('Export Registration Form')
        this.processData.get('description').setValue(`Exported ${this.operationData.get('studentnumber').value}'s Registration Form to PDF.`)
        this.variableService.addProcess(this.processData.value).subscribe()
      }
    })
  }

  //--- EXPORT COG FUNCTION STARTS HERE ---//
  //DIALOG FUNCTION
  openDialog(studentnumber: any) {
    const dialogRef = this.dialog.open(CogDialog, {
      data: { studentnumber: studentnumber }
    })
  }

  //COMMON FUNCTION FOR CLOSING SECTION OF ADDING DROPPING CHANGING EXPORT REGFORM AND COG
  closeSection() {
    this.scheduleList = []
    this.subjEnrolledData = []
    this.addedScheduleList = []
    this.resultSubjectsList = []
    this.schedControl.setValue('')
    this.operationData.get('type').setValue('')
    this.totalHours = 0
    this.totalUnits = 0
    this.totalAmount = 0
    this.pageStyle = '0rem'
    this.isAddOpen = false
    this.isDropOpen = false
    this.isChangeOpen = false
    this.isRegFormOpen = false
    this.isCogOpen = false
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

@Component({
  selector: 'cog-dialog',
  templateUrl: './cog-dialog.html',
  styleUrls: ['./enrolled-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})

export class CogDialog implements OnInit {
  schoolyear: any
  gradeLogData: any
  globalVar: any
  searchForm: any
  searchVisibility: boolean = true

  currentDate = Date.now()

  resultStudInfo: any
  resultColumns: string[] = [
    'subjectcode',
    'subjectTitle',
    'mygrade',
    'makeupgrade',
    'units',
    'creditUnits'
  ]
  resultGradesList: any
  resultDataSource!: MatTableDataSource<any>
  resultVisibility: boolean = false

  totalUnits: number = 0
  totalCreditUnits: number = 0
  aveGrade: number = 0
  passingPercentage: number = 0

  scholarshipList: string[] = [
    'FULL ACADEMIC',
    'PARTIAL ACADEMIC',
    'NONE'
  ]
  scholarship: string = ''
  a4Style = {
    width: '8.3in'
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private gradesService: GradesService,
    private variableService: VariableService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CogDialog>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: this.data.studentnumber, disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.resultStudInfo = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false })
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
      }
    })

    this.gradeLogData = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectcode: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      myprocess: new FormControl({ value: '', disabled: false }),
      mydate: new FormControl({ value: '', disabled: false }),
      mytime: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      username: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.getSchoolyear(this.searchForm.get('studentnumber').value)
  }

  generateCog() {
    let totalUnits: number = 0
    let totalCreditUnits: number = 0
    let aveGrade: number = 0

    if(this.searchForm.get('semester').value == '' || this.searchForm.get('schoolyear').value == '') {
      this.toastr.error('Please fill out all fields.')
    }
    else {
      this.searchVisibility = false
      this.resultVisibility = true

      this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.resultStudInfo.get('studentnumber').setValue(res.student.studentNumber)
          this.resultStudInfo.get('firstname').setValue(res.student.firstName)
          this.resultStudInfo.get('middlename').setValue(res.student.middleName.charAt(0))
          this.resultStudInfo.get('lastname').setValue(res.student.lastName)
          this.resultStudInfo.get('course').setValue(res.student.course)
        }
      })

      this.gradesService.getGradeByStudNumSemSY(
        this.searchForm.get('studentnumber').value,
        this.searchForm.get('semester').value,
        this.searchForm.get('schoolyear').value
      ).subscribe((res) => {
        if(res) {
          let creditunitsControl = { creditUnits: '0' }
          this.resultGradesList = res.grades

          for(let i = 0; i < this.resultGradesList.length; i++) {
            let gradeCounter = this.resultGradesList.length
            this.resultGradesList[i] = Object.assign(this.resultGradesList[i], creditunitsControl)
            this.enrollmentService.getSubjectTitle(this.resultGradesList[i].subjectcode).subscribe((res) => {
              let tmpData: any
              if(res) {
                tmpData = res.subject
                this.resultGradesList[i] = Object.assign(this.resultGradesList[i], tmpData)
                //credit units
                if(
                  this.resultGradesList[i].mygrade == 'INC' ||
                  this.resultGradesList[i].mygrade == 'S'
                ) {
                  if(this.resultGradesList[i].makeupgrade == '-') {
                    this.resultGradesList[i].creditUnits = '0'
                  }
                  else {
                    this.resultGradesList[i].creditUnits = this.resultGradesList[i].units
                  }


                }
                else {
                  this.resultGradesList[i].creditUnits = this.resultGradesList[i].units
                }


                //grade
                if(!Number.isNaN(Number(this.resultGradesList[i].mygrade))) {
                  aveGrade += Number(this.resultGradesList[i].mygrade)
                }
                else {
                  aveGrade += Number(this.resultGradesList[i].makeupgrade)
                }
                totalUnits += Number(this.resultGradesList[i].units)
                this.totalUnits = totalUnits

                totalCreditUnits += Number(this.resultGradesList[i].creditUnits)
                this.totalCreditUnits = totalCreditUnits
                this.passingPercentage = (totalCreditUnits / totalUnits) * 100


                if(i == this.resultGradesList.length - 1) {
                  this.resultDataSource = new MatTableDataSource(this.resultGradesList)

                  if(aveGrade >= 1 && aveGrade <= 1.45) {
                    for(let j = 0; j < this.resultGradesList.length; j++){
                      if(
                        this.resultGradesList[j].mygrade == 'INC' ||
                        this.resultGradesList[j].mygrade == 'US' ||
                        this.resultGradesList[j].mygrade == '4.00' ||
                        this.resultGradesList[j].mygrade == '5.00'
                      ) {
                        this.scholarship = this.scholarshipList[2]
                        break
                      }
                      else {
                        this.scholarship = this.scholarshipList[0]
                      }
                    }

                  }
                  else if(aveGrade >= 1.46 && aveGrade <= 1.75) {
                    for(let j = 0; j < this.resultGradesList.length; j++){
                      if(
                        this.resultGradesList[j].mygrade == 'INC' ||
                        this.resultGradesList[j].mygrade == 'US' ||
                        this.resultGradesList[j].mygrade == '4.00' ||
                        this.resultGradesList[j].mygrade == '5.00'
                      ) {
                        this.scholarship = this.scholarshipList[2]
                        break
                      }
                      else {
                        this.scholarship = this.scholarshipList[1]
                      }
                    }
                  }
                  else {
                    this.scholarship = this.scholarshipList[2]
                  }

                  aveGrade /= gradeCounter
                  this.aveGrade = aveGrade
                  //console.log(aveGrade)
                }
              }

            })

          }
        }
      })
    }
  }

  exportCog() {
    let data: any = document.getElementById('print')
    html2canvas(data).then((canvas) => {
      let fileWidth = 208
      let fileHeight = (canvas.height * fileWidth) / canvas.width
      const fileURI = canvas.toDataURL('image/jpg')
      let pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0
      let date = new Date(Date.now())
      pdf.addImage(fileURI, 'JPG', 0, position, fileWidth, fileHeight)
      pdf.save(
        this.resultStudInfo.get('lastname').value +
        '-cog-' + (date.getMonth() + 1) + '-' +
        date.getDate() + '-' + date.getFullYear() + '.pdf'
      )
    })


    //--- CREATING GRADE LOG OBJECT TO INPUT TO GRADE LOG TABLE ---//
    this.variableService.getIpAddress().subscribe((res) => {
      if(res) {
        let ipAdd = res.clientIp
        let date = new Date()
        this.gradeLogData.get('schedcode').setValue('N/A')
        this.gradeLogData.get('subjectcode').setValue('N/A')
        this.gradeLogData.get('studentnumber').setValue(this.searchForm.get('studentnumber').value)
        this.gradeLogData.get('myprocess').setValue('EXPORT COG')
        this.gradeLogData.get('mydate').setValue(String(
          date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        ))
        this.gradeLogData.get('mytime').setValue(String(
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        ))
        this.gradeLogData.get('ipaddress').setValue(ipAdd)
        this.gradeLogData.get('pcname').setValue(window.location.hostname)
        this.gradeLogData.get('username').setValue(localStorage.getItem('user'))
        this.gradeLogData.get('semester').setValue(this.searchForm.get('semester').value)
        this.gradeLogData.get('schoolyear').setValue(this.searchForm.get('schoolyear').value)
        //--- ADD GRADE LOG TO DB ---//
        this.gradesService.addGradeLog(this.gradeLogData.value).subscribe((res) => {
          if(res) {
            this.toastr.success('COG Exported')
            this.closeDialog()
          }
        })
      }
    })


  }

  closeDialog() {
    this.searchVisibility = true
    this.resultVisibility = false

    this.searchForm.get('studentnumber').setValue('')
    this.searchForm.get('semester').setValue('')
    this.searchForm.get('schoolyear').setValue('')

    this.dialogRef.close()
  }

  getSchoolyear(studentnumber: any) {
    this.gradesService.getSchoolyear(studentnumber).subscribe((res) => {
      if(res) {
        this.schoolyear = res.schoolyear
      }
    })
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
