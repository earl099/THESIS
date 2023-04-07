import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/services/report.service';
import { VariableService } from 'src/app/services/variable.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

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

  //booleans for checking
  isAdvClicked!: boolean
  isAdmin!: boolean
  isReportGenerated!: boolean
  isEnrolledReport!: boolean
  isShifteeReport!: boolean
  isLoaReport!: boolean

  //table title
  title!: string

  //college list and course list
  collegeList: Array<any> = []
  courseList: Array<any> = []
  schoolyearList: Array<any> = []

  //table columns
  enrolledColumns: Array<string> = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'gender',
    'semester',
    'schoolyear'
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
    'schoolyear'
  ]
  //table paginator and sorter for the table
  @ViewChild('enrollPaginator') enrollPaginator!: MatPaginator;
  @ViewChild('enrollSort') enrollSort!: MatSort;
  @ViewChild('shifteePaginator') shifteePaginator!: MatPaginator;
  @ViewChild('shifteeSort') shifteeSort!: MatSort;
  @ViewChild('loaPaginator') loaPaginator!: MatPaginator;
  @ViewChild('loaSort') loaSort!: MatSort;

  //table data
  dataResult: Array<any> = []
  dataSource!: MatTableDataSource<any>
  dataSource1!: MatTableDataSource<any>
  dataSource2!: MatTableDataSource<any>

  constructor(
    private reportService: ReportService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  //on initialize
  ngOnInit(): void {
    this.globalVar = this.variableService.getLegend().subscribe()

    this.reportForm = this.fb.group({
      reportType: new FormControl({ value: '', disabled: false }),
      collegeCode: new FormControl({ value: localStorage.getItem('token'), disabled: false }),
      courseCode: new FormControl({ value: '', disabled: false }),

      //advanced filters for Students Enrolled, w/ LOA and shiftees
      gender: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.isReportGenerated = false
    this.isAdvClicked = false
    this.isEnrolledReport = false
    this.isShifteeReport = false
    this.isLoaReport = false

    if(localStorage.getItem('token') == 'UNIV') {
      this.isAdmin = true
      this.getColleges()
    }
    else {
      this.reportForm.get('collegeCode').setValue(localStorage.getItem('token'))
      this.isAdmin = false
    }

    //console.log(this.reportForm.get('reportType').value)
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
        this.reportForm.get('collegeCode').setValue('ALL')
        this.reportForm.get('courseCode').setValue('ALL')
        this.reportForm.get('gender').setValue('ALL')
        this.reportForm.get('semester').setValue('ALL')
        this.reportForm.get('schoolyear').setValue('ALL')

        this.reportService.advSearchByReportType(this.reportForm.get('reportType').value, this.reportForm.value).subscribe((res) => {
          if(res) {
            let tmpData = res.result
            let tmpData2 = res.infoResult

            //data for different report types
            let enrolledData = []
            let shifteeData = []
            let loaData = []
            let checker = { studentNumber: undefined }

            for (let i = 0; i < tmpData.length; i++) {
              Object.assign(tmpData[i], tmpData2[i])
              switch (this.reportForm.get('reportType').value) {
                case 'stud_enroll':
                  enrolledData.push(tmpData[i])
                  enrolledData.forEach(item => delete item.studentnumber)
                  if(i == tmpData.length - 1) {
                    shifteeData.push(checker)
                    loaData.push(checker)
                  }
                  break

                case 'shiftee':
                  shifteeData.push(tmpData[i])
                  shifteeData.forEach(item => delete item.studentnumber)
                  if(i == tmpData.length - 1) {
                    enrolledData.push(checker)
                    loaData.push(checker)
                  }
                  break

                default:
                  loaData.push(tmpData[i])
                  loaData.forEach(item => delete item.studentnumber)
                  if(i == tmpData.length - 1) {
                    enrolledData.push(checker)
                    shifteeData.push(checker)
                  }
                  break
              }
            }

            if(
              enrolledData[0].studentNumber == undefined &&
              shifteeData[0].studentNumber == undefined &&
              loaData[0].studentNumber == undefined
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
                  console.log(this.dataResult)

                  this.title = 'Shiftees'
                  this.isShifteeReport = true
                  this.dataSource1 = new MatTableDataSource(this.dataResult)
                  this.dataSource1.paginator = this.shifteePaginator
                  this.dataSource1.sort = this.shifteeSort
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
              switch (this.reportForm.get('reportType').value) {
                case 'stud_enroll':
                  this.title = 'Students Enrolled'
                  this.isEnrolledReport = true
                  break

                case 'shiftee':
                  this.title = 'Shiftees'
                  this.isShifteeReport = true
                  break

                default:
                  this.title = 'Leave of Absence'
                  this.isLoaReport = true
                  break
              }

              let tmpData = res.result
              let tmpData2 = res.infoResult
              let finalData = []
              for (let i = 0; i < tmpData.length; i++) {
                Object.assign(tmpData[i], tmpData2[i])
                finalData.push(tmpData[i])
              }
              finalData.forEach(item => delete item.studentnumber)

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

                //setting table data source and paginator and sorter
                this.dataSource = new MatTableDataSource(this.dataResult)
                this.dataSource.paginator = this.enrollPaginator
                this.dataSource.sort = this.enrollSort

                this.isReportGenerated = true
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

    let processData: any
    this.variableService.getIpAddress().subscribe((res) => {
      if(res) {
        let ipAdd = res.clientIp
        switch (this.reportForm.get('reportType').value) {
          case 'stud_enroll':
            processData.get('username').setValue(localStorage.getItem('user'))
            processData.get('ipaddress').setValue(ipAdd)
            processData.get('pcname').setValue(window.location.hostname)
            processData.get('studentnumber').setValue('N/A')
            processData.get('type').setValue('Export Report')
            processData.get('description').setValue(`Exported Report for Students Enrolled`)
            this.variableService.addProcess(processData).subscribe()
            break

          case 'shiftee':
            processData.get('username').setValue(localStorage.getItem('user'))
            processData.get('ipaddress').setValue(ipAdd)
            processData.get('pcname').setValue(window.location.hostname)
            processData.get('studentnumber').setValue('N/A')
            processData.get('type').setValue('Export Report')
            processData.get('description').setValue(`Exported Report for Shiftees`)
            this.variableService.addProcess(processData).subscribe()
            break
          default:
            processData.get('username').setValue(localStorage.getItem('user'))
            processData.get('ipaddress').setValue(ipAdd)
            processData.get('pcname').setValue(window.location.hostname)
            processData.get('studentnumber').setValue('N/A')
            processData.get('type').setValue('Export Report')
            processData.get('description').setValue(`Exported Report for LOA`)
            this.variableService.addProcess(processData).subscribe()
            break
        }

      }
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
