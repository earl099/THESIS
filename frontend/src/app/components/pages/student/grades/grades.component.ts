import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { GradesService } from 'src/app/services/grades.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  date = new Date()
  searchForm: any
  schoolyear: any
  searchVisibility: boolean = true

  courseList: any = []

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

  changingColumns: string[] = [
    'schedcode',
    'subjectcode',
    'mygrade',
    'newGrade',
    'update'
  ]

  completionColumns: string[] = [
    'schedcode',
    'subjectcode',
    'mygrade',
    'makeupgrade',
    'complete'
  ]

  newGradeControl = new FormControl()
  updatedGradeData: Array<any> = []
  updatedGradeForm: any
  ipAdd = ''
  completionVisibility: boolean = false
  changingVisibility: boolean = false
  gradesDataSource!: MatTableDataSource<any>

  adminVisibility!: boolean

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private gradeService: GradesService,
    private reportService: ReportService,
    private userService: UserService,
    private toastr: ToastrService,
    private variableService: VariableService
    ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
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
    this.reportService.getCourses(check).subscribe((res) => {
      if(res) {
        this.courseList = res.course
        console.log(this.courseList)
      }
    })
  }

  //--- ISUPDATE: TRUE IF UPDATING, FALSE IF COMPLETION ---//
  generateData(isUpdate: boolean) {
    if(
      (this.searchForm.get('studentnumber').value == '' ||
      this.searchForm.get('semester').value == '' ||
      this.searchForm.get('schoolyear').value == '') ||
      this.studentInfoForm.get('fullName').value == ''
    ) {
      this.toastr.error('Please fill out all fields.')
    }
    else {
      this.searchVisibility = false
      this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.studentInfoForm.get('studentnumber').setValue(this.searchForm.get('studentnumber').value)
          this.studentInfoForm.get('firstname').setValue(res.student.firstName)
          this.studentInfoForm.get('middlename').setValue(res.student.middleName.at(0) + '.')
          this.studentInfoForm.get('lastname').setValue(res.student.lastName)
          this.studentInfoForm.get('course').setValue(res.student.course)
        }
      })

      this.gradeService.getGradeByStudNumSemSY(
        this.searchForm.get('studentnumber').value,
        this.searchForm.get('semester').value,
        this.searchForm.get('schoolyear').value
      ).subscribe((res) => {
        if(res) {
          let tmpData = res.grades
          if(isUpdate) {
            this.changingVisibility = true
            for (let i = 0; i < tmpData.length; i++) {
              this.updatedGradeData.push(tmpData[i])
            }
          }
          else {
            this.completionVisibility = true
            for (let i = 0; i < tmpData.length; i++) {
              if(tmpData[i].mygrade == 'INC' || tmpData[i].mygrade == '4.00') {
                this.updatedGradeData.push(tmpData[i])
              }
            }
          }
          this.gradesDataSource = new MatTableDataSource(this.updatedGradeData)
        }
      })
    }
  }

  generateProfile(studentnumber: any) {
    if(
      this.searchForm.get('studentnumber').value == '' ||
      this.searchForm.get('semester').value == '' ||
      this.searchForm.get('schoolyear').value == ''
    ) {
      this.toastr.error('Please fill out all fields.')
    }
    else {
      this.studentService.getStudent(studentnumber).subscribe((res) => {
        if(res) {
          this.studentInfoForm.get('studentnumber').setValue(this.searchForm.get('studentnumber').value)
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
    return !this.courseList.find((item: any) => item.courseCode === course)
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
            this.updatedGradeForm.get('semester').setValue(this.searchForm.get('semester').value)
            this.updatedGradeForm.get('schoolyear').setValue(this.searchForm.get('schoolyear').value)

            try {
              this.gradeService.updateGrade(
                this.searchForm.get('studentnumber').value,
                scheduleData.schedcode.toString(), scheduleData.subjectcode.toString(),
                this.updatedGradeForm.value
              ).subscribe()
              this.backToSearch()
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
            this.updatedGradeForm.get('semester').setValue(this.searchForm.get('semester').value)
            this.updatedGradeForm.get('schoolyear').setValue(this.searchForm.get('schoolyear').value)

            try {
              this.gradeService.updateGrade(
                this.searchForm.get('studentnumber').value,
                scheduleData.schedcode.toString(), scheduleData.subjectcode.toString(),
                this.updatedGradeForm.value
              ).subscribe()
              this.backToSearch()
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

  backToSearch() {
    this.searchVisibility = true
    this.completionVisibility = false
    this.changingVisibility = false
    this.updatedGradeData = []
    this.newGradeControl.reset()
    this.searchForm.get('studentnumber').reset()
    this.searchForm.get('semester').reset()
    this.searchForm.get('schoolyear').reset()

    this.studentInfoForm.get('studentnumber').reset()
    this.studentInfoForm.get('firstname').reset()
    this.studentInfoForm.get('middlename').reset()
    this.studentInfoForm.get('lastname').reset()
    this.studentInfoForm.get('course').reset()
    this.studentInfoForm.get('gender').reset()
    this.studentInfoForm.get('fullName').reset()
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
