import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/services/report.service';
import { VariableService } from 'src/app/services/variable.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {
  //global variable for setting current sem and schoolyear
  globalVar: any

  //report search parameters
  reportForm: any

  //loa specific forms
  filterForm: any
  processLogForm: any
  processData: any

  //booleans for checking
  isAdvClicked!: boolean
  isAdmin!: boolean
  isReportGenerated!: boolean
  isEnrolledReport!: boolean
  isShifteeReport!: boolean
  isLoaReport!: boolean
  isAssessedReport!: boolean

  //table title
  title!: string

  //college list and course list
  collegeList: Array<any> = []
  courseList: Array<any> = []
  schoolyearList: Array<any> = []

  //course check list array
  cCheckList: any = []

  //table columns
  enrolledColumns: Array<string> = [
    'semester',
    'schoolyear',
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'gender',

  ]

  shifteeColumns: Array<string> = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'coursefrom',
    'gender',
    'semester',
    'schoolyear'
  ]

  loaColumns: Array<string> = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'dateencoded',
    'gender',
    'semester',
    'schoolyear',
    'delete'
  ]

  assessedColumns: Array<string> = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'gender',
    'StudentStatus',
    'scholarship'
  ]

  //table paginator and sorter for the table
  @ViewChild('enrollPaginator') enrollPaginator!: MatPaginator;
  @ViewChild('enrollSort') enrollSort!: MatSort;
  @ViewChild('shifteePaginator') shifteePaginator!: MatPaginator;
  @ViewChild('shifteeSort') shifteeSort!: MatSort;
  @ViewChild('loaPaginator') loaPaginator!: MatPaginator;
  @ViewChild('loaSort') loaSort!: MatSort;
  @ViewChild('assessedPaginator') assessedPaginator!: MatPaginator;
  @ViewChild('assessedSort') assessedSort!: MatSort;

  //table data
  dataResult: Array<any> = []
  dataSource!: MatTableDataSource<any>
  dataSource1!: MatTableDataSource<any>
  dataSource2!: MatTableDataSource<any>
  dataSource3!: MatTableDataSource<any>

  constructor(
    private reportService: ReportService,
    private studentService: StudentService,
    private userService: UserService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog
  ) { }

  //on initialize
  ngOnInit(): void {
    this.variableService.getLegend().subscribe((res) => {
      this.globalVar = res.legend
    })

    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false }),
    })

    this.processLogForm = this.fb.group({
      encoder: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false })
    })

    this.reportForm = this.fb.group({
      reportType: new FormControl({ value: '', disabled: false }),
      collegeCode: new FormControl({ value: this.userService.getToken(), disabled: false }),
      courseCode: new FormControl({ value: '', disabled: false }),

      //advanced filters for Students Enrolled, w/ LOA and shiftees
      gender: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    //filter for loa
    this.filterForm = this.fb.group({
      collegeCode: new FormControl({ value: localStorage.getItem('token'), disabled: false }),
      courseCode: new FormControl({ value: 'ALL', disabled: false }),
      gender: new FormControl({ value: 'ALL', disabled: false }),
      semester: new FormControl({ value: 'ALL', disabled: false }),
      schoolyear: new FormControl({ value: 'ALL', disabled: false })
    })

    this.isReportGenerated = false
    this.isAdvClicked = false
    this.isEnrolledReport = false
    this.isShifteeReport = false
    this.isLoaReport = false
    this.isAssessedReport = false

    if(localStorage.getItem('token') == 'UNIV') {
      this.isAdmin = true
      this.getColleges()
    }
    else {
      this.reportForm.get('collegeCode').setValue(localStorage.getItem('token'))
      this.isAdmin = false
    }

    let check = this.userService.getToken()
    this.reportService.getCourses(check).subscribe((res) => {
      if(res) {
        this.cCheckList = res.course
        this.courseList = res.course
      }
    })
    //console.log(this.reportForm.get('reportType').value)
  }

  courseCheck(course: any) {
    return !this.cCheckList.find((item: any) => item.courseCode === course)
  }

  onAdvClick() {
    if(!this.isAdvClicked) {
      this.isAdvClicked = true
    }
    else {
      this.isAdvClicked = false
    }
  }

  getSchoolyear(type: string) {
    this.reportService.getSchoolYearbyReportType(type).subscribe((res) => {
      if(res) {
        let tmpData = res.schoolyear
        //console.log(tmpData)
        if(tmpData.length > 0){
          this.schoolyearList.splice(0, this.schoolyearList.length)
        }
        for (let i = 0; i < tmpData.length; i++) {
          this.schoolyearList.push(tmpData[i])
        }
      }
    })
  }

  getColleges() {
    this.reportService.getColleges().subscribe((res) => {
      if(res) {
        let tmpData = res.college
        for (let i = 0; i < tmpData.length; i++) {
          this.collegeList.push(tmpData[i])
          if (i == tmpData.length - 1) {
            this.collegeList.push({collegeCode: 'ALL'})
          }
        }
        //console.log(this.collegeList)
      }
    })
  }

  getCourses(college: string) {
    this.reportService.getCourses(college).subscribe((res) => {
      if(res) {
        let tmpData = res.course
        if(this.courseList.length > 0) {
          this.courseList.splice(0, this.courseList.length)
        }

        for (let i = 0; i < tmpData.length; i++) {
          this.courseList.push(tmpData[i])
        }
        //console.log(this.courseList)
      }
    })
  }

  generateReport() {
    //if no report type specified
    if(this.reportForm.get('reportType').value == '') {
      this.toastr.error('Please put a Report Type')
    }
    else {
      if(!this.isAdvClicked) {
        if(this.userService.getToken() == 'UNIV') {
          this.reportForm.get('collegeCode').setValue('ALL')
        }
        this.reportForm.get('courseCode').setValue('ALL')
        this.reportForm.get('gender').setValue('ALL')
        this.reportForm.get('semester').setValue(this.globalVar[0].semester)
        this.reportForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)

        this.reportService.advSearchByReportType(this.reportForm.get('reportType').value, this.reportForm.value).subscribe((res) => {
          if(res) {
            let tmpData = res.result
            let tmpData2 = res.infoResult

            console.log(tmpData)
            console.log(tmpData2)

            //data for different report types
            let enrolledData = []
            let shifteeData = []
            let loaData = []
            let assessedData = []
            let checker = { studentNumber: undefined }

            for (let i = 0; i < tmpData.length; i++) {
              Object.assign(tmpData[i], tmpData2[i])
              switch (this.reportForm.get('reportType').value) {
                case 'stud_enroll':
                  if(this.courseCheck(tmpData2.course)) {
                    enrolledData.push(tmpData[i])
                    enrolledData.forEach(item => delete item.studentnumber)
                    if(i == tmpData.length - 1) {
                      shifteeData.push(checker)
                      assessedData.push(checker)
                      loaData.push(checker)
                    }
                  }
                  break

                case 'shiftee':
                  if(this.courseCheck(tmpData2.course)) {
                    shifteeData.push(tmpData[i])
                    shifteeData.forEach(item => delete item.studentnumber)
                    if(i == tmpData.length - 1) {
                      enrolledData.push(checker)
                      assessedData.push(checker)
                      loaData.push(checker)
                    }
                  }
                  break

                case 'assessed':
                  if(this.courseCheck(tmpData2.course)) {
                    assessedData.push(tmpData[i])
                    assessedData.forEach(item => delete item.studentnumber)
                    if(i == tmpData.length - 1) {
                      enrolledData.push(checker)
                      shifteeData.push(checker)
                      loaData.push(checker)
                    }
                  }
                  break

                default:
                  loaData.push(tmpData[i])
                  loaData.forEach(item => delete item.studentnumber)
                  if(i == tmpData.length - 1) {
                    enrolledData.push(checker)
                    assessedData.push(checker)
                    shifteeData.push(checker)
                  }
                  break
              }
            }


            if(
              enrolledData[0].studentNumber == undefined &&
              shifteeData[0].studentNumber == undefined &&
              loaData[0].studentNumber == undefined &&
              assessedData[0].studentNumber == undefined
            ) {
              this.toastr.error('No result found.')
            }
            else {
              //refreshing the array
              if(this.dataResult.length > 0) {
                this.dataResult.splice(0, this.dataResult.length)
              }

              //adding data to data result
              switch (this.reportForm.get('reportType').value) {
                case 'stud_enroll':
                  for (let i = 0; i < enrolledData.length; i++) {
                    this.dataResult.push(enrolledData[i])
                  }
                  //console.log(this.dataResult)

                  this.title = 'Students Enrolled'
                  this.isEnrolledReport = true
                  this.dataSource = new MatTableDataSource(this.dataResult)
                  this.dataSource.paginator = this.enrollPaginator
                  this.dataSource.sort = this.enrollSort
                  break

                case 'shiftee':
                  for (let i = 0; i < shifteeData.length; i++) {
                    this.dataResult.push(shifteeData[i])
                  }

                  for (let i = 0; i < this.dataResult.length; i++) {
                    if(this.dataResult[i].course == this.dataResult[i].coursefrom) {
                      this.dataResult.splice(i, 1)
                    }
                  }

                  this.title = 'Shiftees'
                  this.isShifteeReport = true
                  this.dataSource1 = new MatTableDataSource(this.dataResult)
                  this.dataSource1.paginator = this.shifteePaginator
                  this.dataSource1.sort = this.shifteeSort
                  break

                case 'assessed':
                  console.log(assessedData)
                  for (let i = 0; i < assessedData.length; i++) {
                    if(this.userService.getToken() == 'UNIV') {
                      this.dataResult.push(assessedData[i])
                    }
                    else {
                      if(!this.courseCheck(assessedData[i].course)) {
                        this.dataResult.push(assessedData[i])
                      }
                    }

                  }
                  console.log(this.dataResult)
                  this.title = 'Assessed Students'
                  this.isAssessedReport = true
                  this.dataSource3 = new MatTableDataSource(this.dataResult)
                  this.dataSource3.paginator = this.assessedPaginator
                  this.dataSource3.sort = this.assessedSort
                  break

                default:
                  for (let i = 0; i < loaData.length; i++) {
                    this.dataResult.push(loaData[i])
                  }
                  this.title = 'Leave of Absence'
                  this.isLoaReport = true
                  this.dataSource2 = new MatTableDataSource(this.dataResult)
                  this.dataSource2.paginator = this.loaPaginator
                  this.dataSource2.sort = this.loaSort
                  break;
              }
              this.isReportGenerated = true
            }
          }
        })
      }
      else {
        if(this.reportForm.get('reportType').value == '') {
          this.toastr.error('Please put a Report Type')
        }
        //if fields are not filled
        else if(
          this.reportForm.get('collegeCode').value == '' ||
          this.reportForm.get('courseCode').value == '' ||
          this.reportForm.get('gender').value == '' ||
          this.reportForm.get('semester').value == '' ||
          this.reportForm.get('schoolyear').value == ''
        ) {
          this.toastr.error('Please fill out all fields.')
        }
        else {
          this.reportService.advSearchByReportType(this.reportForm.get('reportType').value, this.reportForm.value).subscribe((res) => {
            if(res) {
              let tmpData = res.result
              let tmpData2 = res.infoResult
              let finalData = []
              for (let i = 0; i < tmpData.length; i++) {
                if(tmpData2[i] == null) {
                  continue
                }
                else {
                  Object.assign(tmpData[i], tmpData2[i])
                  finalData.push(tmpData[i])
                }

              }

              if(this.reportForm.get('reportType').value != 'shiftee') {
                finalData.forEach(item => { item.courseto = '' })
              }

              if(finalData[0].studentNumber == undefined) {
                this.toastr.error('No result found.')
              }
              else {

                //refreshing the array
                if(this.dataResult.length > 0) {
                  this.dataResult.splice(0, this.dataResult.length)
                }

                //adding data to data result
                for (let i = 0; i < finalData.length; i++) {
                  this.dataResult.push(finalData[i])
                }
                this.dataResult.forEach(item => delete item.studentnumber)
                //console.log(this.dataResult)

                switch (this.reportForm.get('reportType').value) {
                  case 'stud_enroll':
                    this.title = 'Students Enrolled'
                    this.isEnrolledReport = true
                    //setting table data source and paginator and sorter
                    this.dataSource = new MatTableDataSource(this.dataResult)
                    this.dataSource.paginator = this.enrollPaginator
                    this.dataSource.sort = this.enrollSort
                    this.isReportGenerated = true
                    break

                  case 'shiftee':
                    this.title = 'Shiftees'
                    this.isShifteeReport = true
                    //setting table data source and paginator and sorter
                    this.dataSource1 = new MatTableDataSource(this.dataResult)
                    this.dataSource1.paginator = this.enrollPaginator
                    this.dataSource1.sort = this.enrollSort
                    this.isReportGenerated = true
                    break

                  case 'assessed':
                    this.title = 'Assessed Students'
                    this.isAssessedReport = true
                    //setting table data source and paginator and sorter
                    this.dataSource3 = new MatTableDataSource(this.dataResult)
                    this.dataSource3.paginator = this.enrollPaginator
                    this.dataSource3.sort = this.enrollSort
                    this.isReportGenerated = true
                    break

                  default:
                    this.title = 'Leave of Absence'
                    this.isLoaReport = true
                    //setting table data source and paginator and sorter
                    this.dataSource2 = new MatTableDataSource(this.dataResult)
                    this.dataSource2.paginator = this.enrollPaginator
                    this.dataSource2.sort = this.enrollSort
                    this.isReportGenerated = true
                    break
                }


              }
            }
          })
        }
      }
    }
  }

  generateCSV() {
    let options
    switch (this.reportForm.get('reportType').value) {
      case 'stud_enroll':
        options = {
          headers: this.enrolledColumns,
          showLabels: true
        }
        break

      case 'shiftee':
        options = {
          headers: this.shifteeColumns,
          showLabels: true
        }
        break
      default:
        options = {
          headers: this.loaColumns,
          showLabels: true
        }
        break;
    }

    new ngxCsv(this.dataResult, 'Report-' + this.reportForm.get('reportType').value, options)

    this.variableService.getIpAddress().subscribe((res) => {
      if(res) {
        let ipAdd = res.clientIp
        switch (this.reportForm.get('reportType').value) {
          case 'stud_enroll':
            this.processData.get('username').setValue(localStorage.getItem('user')?.toString())
            this.processData.get('ipaddress').setValue(ipAdd)
            this.processData.get('pcname').setValue(window.location.hostname)
            this.processData.get('studentnumber').setValue('N/A')
            this.processData.get('type').setValue('Export Report')
            this.processData.get('description').setValue(`Exported Report for Students Enrolled`)
            this.variableService.addProcess(this.processData.value).subscribe()
            break

          case 'shiftee':
            this.processData.get('username').setValue(localStorage.getItem('user'))
            this.processData.get('ipaddress').setValue(ipAdd)
            this.processData.get('pcname').setValue(window.location.hostname)
            this.processData.get('studentnumber').setValue('N/A')
            this.processData.get('type').setValue('Export Report')
            this.processData.get('description').setValue(`Exported Report for Shiftees`)
            this.variableService.addProcess(this.processData.value).subscribe()
            break
          default:
            this.processData.get('username').setValue(localStorage.getItem('user'))
            this.processData.get('ipaddress').setValue(ipAdd)
            this.processData.get('pcname').setValue(window.location.hostname)
            this.processData.get('studentnumber').setValue('N/A')
            this.processData.get('type').setValue('Export Report')
            this.processData.get('description').setValue(`Exported Report for LOA`)
            this.variableService.addProcess(this.processData.value).subscribe()
            break
        }

      }
    })
  }

  filterLoa() {
    this.reportForm.get('reportType').setValue('loa')

    if(
      this.filterForm.get('collegeCode').value == '' ||
      this.filterForm.get('collegeCode').value == 'ALL'
    ) {
      this.filterForm.get('collegeCode').setValue('ALL')
    }

    this.getCourses(this.filterForm.get('collegeCode').value)

    if(
      this.filterForm.get('courseCode').value == '' ||
      this.filterForm.get('courseCode').value == 'ALL'
    ) {
      this.filterForm.get('courseCode').setValue('ALL')
    }

    if(
      this.filterForm.get('gender').value == '' ||
      this.filterForm.get('gender').value == 'ALL'
    ) {
      this.filterForm.get('gender').setValue('ALL')
    }

    if(
      this.filterForm.get('semester').value == '' ||
      this.filterForm.get('semester').value == 'ALL'
    ) {
      this.filterForm.get('semester').setValue('ALL')
    }

    if(
      this.filterForm.get('schoolyear').value == '' ||
      this.filterForm.get('schoolyear').value == 'ALL'
    ) {
      this.filterForm.get('schoolyear').setValue('ALL')
    }

    this.reportService.advSearchByReportType(this.reportForm.get('reportType').value, this.filterForm.value).subscribe({
      next: (res) => {
        if(res) {
          let tmpData = res.result
          let tmpData2 = res.infoResult
          let finalData = []
          for(let i = 0; i < tmpData2.length; i++) {
            if(tmpData2[i] == null) {
              continue
            }
            else {
              Object.assign(tmpData[i], tmpData2[i])
              finalData.push(tmpData[i])
            }
          }

          this.dataSource2.disconnect()
          this.dataSource2 = new MatTableDataSource(finalData)
        }
      }
    })
  }

  deleteLoa(studentnumber: any, data: any) {
    console.log(studentnumber)
    if(confirm('Are you sure you want to remove this record?')) {
      this.variableService.getIpAddress().subscribe((res) => {
        if(res) {
          data.encoder = localStorage.getItem('user')
          data.ipaddress = res.clientIp

          this.studentService.deleteLoa(studentnumber, data).subscribe((res) => {
            if(res) {
              this.toastr.success('Record Deleted.')
              this.dataSource2.disconnect()
              this.generateReport()
            }
          })
        }
      })
    }
    else {
      this.toastr.info('Deletion Cancelled')
    }
  }

  openAddLoaDialog() {
    const dialogRef = this.dialog.open(AddLoaDialog)
    dialogRef.afterClosed().subscribe(() => {
      this.generateReport()
    })
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

// ADD LOA DIALOG
@Component({
  selector: 'addLoa-Dialog',
  templateUrl: './addLoaDialog.html',
  styleUrls:['./generate-report.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AddLoaDialog implements OnInit {
  globalVar: any
  addLoaForm: any
  studList!: Array<any>
  enrolledStuds: any

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private variableService: VariableService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddLoaDialog>
  ) {}

  ngOnInit(): void {
    this.addLoaForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      course: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false }),
      encoder: new FormControl({ value: '', disabled: false }),
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false })
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend[0]

        this.enrollmentService.getStudsEnroll(this.globalVar.semester, this.globalVar.schoolyear).subscribe((res) => {
          if(res) {
            this.enrolledStuds = res.studsEnroll
          }
        })

        this.studentService.adminSearch().subscribe((res) => {
          if(res) {
            if(res.studsWithLoa != undefined) {
              this.studList = res.studsWithLoa
            }
            else {
              this.studList = []
            }
          }

        })
      }
    })
  }

  confirmAdd() {
    if(confirm('Are you sure you want to add this record to the list of students with LOA?')) {
      for (let i = 0; i < this.enrolledStuds.length; i++) {
        if(this.enrolledStuds[i].studentnumber == this.addLoaForm.get('studentnumber').value) {
          this.toastr.error('Student is enrolled.')
          break
        }

        if(this.studList != undefined) {
          for (let j = 0; j < this.studList.length; j++) {
            if(this.studList[j].studentnumber == this.addLoaForm.get('studentnumber').value) {
              this.toastr.error('Student Already Added.')
              break
            }
          }
        }


        if(this.toastr.previousToastMessage != null) {
          break
        }
        else {
          if(i == this.enrolledStuds.length - 1) {
            this.variableService.getIpAddress().subscribe((res) => {
              if(res) {

                this.addLoaForm.get('semester').setValue(this.globalVar.semester)
                this.addLoaForm.get('schoolyear').setValue(this.globalVar.schoolyear)
                this.addLoaForm.get('encoder').setValue(window.location.hostname)
                this.addLoaForm.get('username').setValue(localStorage.getItem('user'))
                this.addLoaForm.get('ipaddress').setValue(res.clientIp)

                this.studentService.addLoa(this.addLoaForm.value).subscribe((res) => {
                  if(res) {
                    this.toastr.success('Added LOA Record')
                    this.closeDialog()
                  }
                })
              }
            })
          }
        }
      }
    }
  }

  getCourse(studnum: any) {
    this.studentService.getStudent(studnum).subscribe((res) => {
      if(res) {
        this.addLoaForm.get('course').setValue(res.student.course)
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

  closeDialog() {
    this.dialogRef.close()
  }
}
