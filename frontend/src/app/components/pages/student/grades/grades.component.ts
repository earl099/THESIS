import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GradesService } from 'src/app/services/grades.service';
import { ReportService } from 'src/app/services/report.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  globalVar: any
  date = new Date()
  studSearchForm: any
  schedSearchForm: any

  schedData = {
    schedcode: '',
    subjectcode: '',
    section: ''
  }

  filteredSched!: Observable<any>
  schoolyear: any
  //base search for choosing between student search
  baseSearch: boolean = true
  //student search
  studSearch: boolean = false
  //sched search
  schedSearch: boolean = false
  isSchedGenerated: boolean = false
  schedControl = new FormControl('0')
  isAdmin!: boolean

  courseList: any = []
  schedList: any = []

  studentInfoForm: any

  gradeList: string[] = [
    '1.00',
    '1.25',
    '1.50',
    '1.75',
    '2.00',
    '2.25',
    '2.50',
    '2.75',
    '3.00',
    'S',
    '4.00',
    'INC',
    '5.00',
  ]

  studChangingColumns: string[] = [
    'schedcode',
    'subjectcode',
    'mygrade',
    'newGrade',
    'update'
  ]

  schedChangingColumns: string[] = [
    'studentnumber',
    'lastName',
    'firstName',
    'middleName',
    'suffix',
    'mygrade',
    'newGrade',
    'update'
  ]

  newGradeControl = new FormControl()
  updatedGradeData: Array<any> = []
  updatedGradeForm: any
  ipAdd = ''
  studCompVisibility: boolean = false
  studChangeVisibility: boolean = false
  schedCompVisibility: boolean = false
  schedChangeVisibility: boolean = false

  studGradesDataSource!: MatTableDataSource<any>
  schedGradesDataSource!: MatTableDataSource<any>

  adminVisibility!: boolean

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private gradeService: GradesService,
    private scheduleService: ScheduleService,
    private reportService: ReportService,
    private userService: UserService,
    private toastr: ToastrService,
    private variableService: VariableService
    ) { }

  ngOnInit(): void {
    this.schedSearchForm = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false })
    })

    this.studSearchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false }),
    })

    this.studentInfoForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false }),
      gender: new FormControl({ value: '', disabled: false }),
      fullName: new FormControl({ value: '', disabled: false })
    })

    this.updatedGradeForm = this.fb.group({
      mygrade: new FormControl({ value: '', disabled: false }),
      mygradeedit: new FormControl({ value: '', disabled: false }),
      mygradeeditdate: new FormControl({ value: '', disabled: false }),
      makeupgrade: new FormControl({ value: '', disabled: false }),
      makeupencoder: new FormControl({ value: '', disabled: false }),
      makeupdate: new FormControl({ value: '', disabled: false }),

      //grade logs data
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      username: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.setAdminVisibility()

    let check: any = this.userService.getToken()
    if(check == 'UNIV') {
      this.isAdmin = true
    }
    else {
      this.isAdmin = false
    }

    this.reportService.getCourses(check).subscribe((res) => {
      if(res) {
        this.courseList = res.course
        console.log(this.courseList)
      }
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
        //console.log(this.globalVar)
        this.scheduleService.getSchedulesBySemSY(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            this.schedList = res.schedules
          }
        })
      }
    })
  }

  //-- SEARCH SWITCH IF TRUE, BY STUDENT, ELSE, BY SCHEDCODE --//
  searchSwitch(trigger: boolean) {
    if(trigger) {
      this.studSearch = true
    }
    else {
      this.schedSearch = true
    }
    this.baseSearch = false
  }

  //-- STUDENT SEARCH FUNCTIONS START HERE --//
  //--- ISUPDATE: TRUE IF UPDATING, FALSE IF COMPLETION ---//
  generateStudData(isUpdate: boolean) {
    if(
      (this.studSearchForm.get('studentnumber').value == '' ||
      this.studSearchForm.get('semester').value == '' ||
      this.studSearchForm.get('schoolyear').value == '') ||
      this.studentInfoForm.get('fullName').value == ''
    ) {
      this.toastr.error('Please fill out all fields.')
    }
    else {
      this.studSearch = false
      this.studentService.getStudent(this.studSearchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.studentInfoForm.get('studentnumber').setValue(this.studSearchForm.get('studentnumber').value)
          this.studentInfoForm.get('firstname').setValue(res.student.firstName)
          this.studentInfoForm.get('middlename').setValue(res.student.middleName.at(0) + '.')
          this.studentInfoForm.get('lastname').setValue(res.student.lastName)
          this.studentInfoForm.get('course').setValue(res.student.course)
        }
      })

      this.gradeService.getGradeByStudNumSemSY(
        this.studSearchForm.get('studentnumber').value,
        this.studSearchForm.get('semester').value,
        this.studSearchForm.get('schoolyear').value
      ).subscribe((res) => {
        if(res) {
          let tmpData = res.grades
          if(isUpdate) {
            this.studChangeVisibility = true
            for (let i = 0; i < tmpData.length; i++) {
              this.updatedGradeData.push(tmpData[i])
            }
          }
          else {
            this.studCompVisibility = true
            for (let i = 0; i < tmpData.length; i++) {
              if((tmpData[i].mygrade == 'INC' || tmpData[i].mygrade == '4.00') && tmpData[i].makeupgrade == '-') {
                this.updatedGradeData.push(tmpData[i])
              }
              else {

              }
            }
          }
          this.studGradesDataSource = new MatTableDataSource(this.updatedGradeData)
        }
      })
    }
  }

  //--- GENERATE STUDENT PROFILE ---//
  generateProfile(studentnumber: any) {
    if(
      this.studSearchForm.get('studentnumber').value == '' ||
      this.studSearchForm.get('semester').value == '' ||
      this.studSearchForm.get('schoolyear').value == ''
    ) {
      this.toastr.error('Please fill out all fields.')
    }
    else {
      this.studentService.getStudent(studentnumber).subscribe((res) => {
        if(res) {
          this.studentInfoForm.get('studentnumber').setValue(this.studSearchForm.get('studentnumber').value)
          this.studentInfoForm.get('firstname').setValue(res.student.firstName)
          this.studentInfoForm.get('middlename').setValue(res.student.middleName.at(0) + '.')
          this.studentInfoForm.get('lastname').setValue(res.student.lastName)
          this.studentInfoForm.get('course').setValue(res.student.course)
          this.studentInfoForm.get('gender').setValue(res.student.gender)
          this.studentInfoForm.get('fullName').setValue(
            this.studentInfoForm.get('firstname').value + ' ' +
            this.studentInfoForm.get('middlename').value + ' ' +
            this.studentInfoForm.get('lastname').value
          )
        }
      })
    }

  }

  getSchoolyear(studentnumber: any) {
    this.gradeService.getSchoolyear(studentnumber).subscribe((res) => {
      if(res) {
        this.schoolyear = res.schoolyear
      }
    })
  }

  courseCheck(course: any) {
    if(this.userService.getToken() != 'UNIV') {
      return !this.courseList.find((item: any) => item.courseCode === course)
    }
    else {
      return false
    }
  }

  setAdminVisibility() {
    if(this.userService.getToken() == 'UNIV') {
      this.adminVisibility = true
    }
    else {
      this.adminVisibility = false
    }
  }

  initCompletion(scheduleData: any, newGrade: any) {
    if(confirm('Are you sure you want to update this grade?')) {
      if(scheduleData.mygrade == newGrade) {
        this.toastr.error('New Grade should not be the same as the current Grade.')
      }
      else {
        this.variableService.getIpAddress().subscribe((res) => {
          if(res) {
            this.updatedGradeForm.get('mygrade').setValue(scheduleData.mygrade)
            this.updatedGradeForm.get('mygradeedit').setValue(scheduleData.mygradeedit)
            this.updatedGradeForm.get('mygradeeditdate').setValue(scheduleData.mygradeeditdate)
            this.updatedGradeForm.get('makeupgrade').setValue(newGrade)
            this.updatedGradeForm.get('makeupencoder').setValue(localStorage.getItem('user'))
            this.updatedGradeForm.get('makeupdate').setValue(
              (this.date.getMonth() + 1) + '/' + this.date.getDate() + '/' + this.date.getFullYear() + ' ' +
              this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds()
            )

            this.ipAdd = res.clientIp

            //grade log data
            this.updatedGradeForm.get('ipaddress').setValue(this.ipAdd)
            this.updatedGradeForm.get('pcname').setValue(window.location.hostname)
            this.updatedGradeForm.get('username').setValue(localStorage.getItem('user'))
            this.updatedGradeForm.get('semester').setValue(this.studSearchForm.get('semester').value)
            this.updatedGradeForm.get('schoolyear').setValue(this.studSearchForm.get('schoolyear').value)

            try {
              this.gradeService.updateGrade(
                this.studSearchForm.get('studentnumber').value,
                scheduleData.schedcode.toString(), scheduleData.subjectcode.toString(),
                this.updatedGradeForm.value
              ).subscribe()
              this.backToStudSearch()
              this.toastr.success('Grade Update Successful')
            } catch (error) {
              this.toastr.error('Grade Update Failed')
              console.log(error)
            }

          }

        })

      }
    }
  }

  initUpdate(scheduleData: any, newGrade: any) {
    if(confirm('Are you sure you want to update this grade?')) {
      if(scheduleData.mygrade == newGrade) {
        this.toastr.error('New Grade should not be the same as the current Grade.')
      }
      else {
        this.variableService.getIpAddress().subscribe((res) => {
          if(res) {
            this.updatedGradeForm.get('mygrade').setValue(newGrade)
            this.updatedGradeForm.get('mygradeedit').setValue(localStorage.getItem('user'))
            this.updatedGradeForm.get('mygradeeditdate').setValue(
              (this.date.getMonth() + 1) + '/' + this.date.getDate() + '/' + this.date.getFullYear() + ' ' +
              this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds()
            )
            this.updatedGradeForm.get('makeupgrade').setValue('-')
            this.updatedGradeForm.get('makeupencoder').setValue('N/A')
            this.updatedGradeForm.get('makeupdate').setValue('N/A')

            this.ipAdd = res.clientIp

            //grade log data
            this.updatedGradeForm.get('ipaddress').setValue(this.ipAdd)
            this.updatedGradeForm.get('pcname').setValue(window.location.hostname)
            this.updatedGradeForm.get('username').setValue(localStorage.getItem('user'))
            this.updatedGradeForm.get('semester').setValue(this.studSearchForm.get('semester').value)
            this.updatedGradeForm.get('schoolyear').setValue(this.studSearchForm.get('schoolyear').value)

            try {
              this.gradeService.updateGrade(
                this.studSearchForm.get('studentnumber').value,
                scheduleData.schedcode.toString(), scheduleData.subjectcode.toString(),
                this.updatedGradeForm.value
              ).subscribe()
              if(this.studChangeVisibility || this.studCompVisibility) {
                this.backToStudSearch()
              }
              else {
                this.backToSchedSearch()
              }

              this.toastr.success('Grade Update Successful')
            } catch (error) {
              this.toastr.error('Grade Update Failed')
              console.log(error)
            }

          }

        })

      }
    }
  }

  backToStudSearch() {
    this.studSearch = true
    this.studCompVisibility = false
    this.studChangeVisibility = false
    this.updatedGradeData = []
    this.newGradeControl.reset()
    this.studSearchForm.get('studentnumber').reset()
    this.studSearchForm.get('semester').reset()
    this.studSearchForm.get('schoolyear').reset()

    this.studentInfoForm.get('studentnumber').reset()
    this.studentInfoForm.get('firstname').reset()
    this.studentInfoForm.get('middlename').reset()
    this.studentInfoForm.get('lastname').reset()
    this.studentInfoForm.get('course').reset()
    this.studentInfoForm.get('gender').reset()
    this.studentInfoForm.get('fullName').reset()
  }
  //-- STUDENT SEARCH FUNCTIONS ENDS HERE --//

  //--- SCHEDCODE SEARCH FUNCTION STARTS HERE ---//
  generateSchedProfile(schedcode: string) {
    this.scheduleService.getSchedule(schedcode).subscribe((res) => {
      if(res) {
        this.schedData.schedcode = res.schedule.schedcode
        this.schedData.subjectcode = res.schedule.subjectCode
        this.schedData.section = res.schedule.section
        this.isSchedGenerated = true
        //console.log(this.schedData)
      }
    })
  }

  generateSchedData(isUpdate: boolean, schedcode: any) {
    if(!this.isSchedGenerated) {
      this.toastr.error('Schedule Code Profile must be generated first.')
    }
    else {
      if(isUpdate) {
        let data: any[] = []
        this.schedChangeVisibility = true
        this.schedSearch = false
        this.gradeService.getGradesBySchedcode(schedcode).subscribe((res) => {
          if(res) {
            let tmpData = res.grades
            for(let i = 0; i < tmpData.length; i++) {
              this.studentService.getStudent(tmpData[i].studentnumber).subscribe((res) => {
                if(res) {
                  let tmpData2 = res.student
                  data.push(Object.assign(tmpData[i], tmpData2))
                  delete data[i].studentNumber
                  if(i == tmpData.length - 1) {
                    this.schedGradesDataSource = new MatTableDataSource(data)
                  }
                }
              })
            }
            console.log(data)
          }
        })
      }
      else {
        let data: any[] = []
        this.schedCompVisibility = true
        this.schedSearch = false
        this.gradeService.getGradesBySchedcode(schedcode).subscribe((res) => {
          if(res) {
            let tmpData = res.grades
            for(let i = 0; i < tmpData.length; i++) {
              this.studentService.getStudent(tmpData[i].studentnumber).subscribe((res) => {
                if(res) {
                  let tmpData2 = res.student
                  if(tmpData[i].mygrade == 'INC' || tmpData[i].mygrade == '4.00') {
                    data.push(Object.assign(tmpData[i], tmpData2))
                    delete data[i].studentNumber
                    if(i == tmpData.length - 1) {
                      this.schedGradesDataSource = new MatTableDataSource(data)
                    }
                  }
                }
              })
            }
            console.log(data)
          }
        })
      }
    }
  }

  backToSchedSearch() {
    this.schedSearch = true
    this.schedChangeVisibility = false
    this.schedCompVisibility = false
    this.schedSearchForm.get('schedcode').setValue('')
    this.schedData.schedcode = ''
    this.schedData.subjectcode = ''
    this.schedData.section = ''
  }
  //--- SCHEDCODE SEARCH FUNCTION ENDS HERE ---//

  backToSearchType() {
    this.studSearch = false
    this.schedSearch = false
    this.baseSearch = true
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
