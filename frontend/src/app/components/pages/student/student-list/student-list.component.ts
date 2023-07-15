import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/services/variable.service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ReportService } from 'src/app/services/report.service';
import { ngxCsv } from 'ngx-csv';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  processData: any

  csvRecords: any;
  header: boolean = true;

  columns: string[] = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'edit',
    'shiftTo',
    'confirmShift'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //--- DATA FOR DISPLAYING IN THE LIST ---//
  courseList: any = [];
  students: any = [];
  globalVars: any;
  courseChecker: any = []

  //--- FORMS FOR INSERTING TO THE DATABASE ---//
  shifteeForm: any;
  studentInfoForm: any;

  dataSource!: MatTableDataSource<any>;

  constructor(
    private studentService: StudentService,
    private reportService: ReportService,
    private userService: UserService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private csvParser: NgxCsvParser,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngOnInit(): void {
    this.studentInfoForm = this.fb.group({
      studentNumber: new FormControl(),
      course: new FormControl()
    })

    this.shifteeForm = this.fb.group({
      studentnumber: new FormControl({value: '', disabled: false}),
      coursefrom: new FormControl({value: '', disabled: false}),
      courseto: new FormControl({value: '', disabled: false}),
      semester: new FormControl({value: '', disabled: false}),
      schoolyear: new FormControl({value: '', disabled: false})
    })

    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })

    this.getCourseChecker()
    this.getStudents();
    this.getCourseList();
    this.getVariables();
  }

  getStudents() {
    this.studentService.getAllStudents().subscribe((res) => {
      if(res) {
        let tmpData = res.students
        //console.log(tmpData)

        for(let i = 0; i < tmpData.length; i++) {
          if(!this.courseCheck(tmpData[i].course)) {
            this.students.push(tmpData[i])
          }
          else {
            continue
          }
        }
        //console.log(this.students)

        this.dataSource = new MatTableDataSource(this.students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.students)
      }
    })
  }

  getCourseChecker() {
    let check = this.userService.getToken()

    if(check == 'UNIV') {
      this.reportService.getCourses('ALL').subscribe((res) => {
        if(res) {
          this.courseChecker = res.course;
        }
      })
    }
    else {
      this.reportService.getCourses(check).subscribe((res) => {
        if(res) {
          this.courseChecker = res.course
        }
      })
    }

  }

  courseCheck(course: any) {
    return !this.courseChecker.find((item: any) => item.courseCode === course)
  }

  getCourseList() {
    this.reportService.getCourses('ALL').subscribe((res) => {
      if(res) {
        this.courseList = res.course;
      }
    })
  }

  getVariables() {
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVars = res.legend
        //console.log(this.globalVars[0])
      }
    })
  }

  initChangeCourse(studentNumber: any, coursefrom: any, courseto: any) {
    /* CHANGES COURSE OF STUDENT INFO FORM TO UPDATE IN DATABASE */
    this.studentInfoForm.get('studentNumber').setValue(studentNumber)
    this.studentInfoForm.get('course').setValue(courseto)
    //console.log(this.studentInfoForm.value)

    /* INPUTS DATA TO SHIFTEE FORM FOR ADDING IN DATABASE */
    this.shifteeForm.get('studentnumber').setValue(studentNumber)
    this.shifteeForm.get('coursefrom').setValue(coursefrom)
    this.shifteeForm.get('courseto').setValue(courseto)
    this.shifteeForm.get('semester').setValue(this.globalVars[0].semester)
    this.shifteeForm.get('schoolyear').setValue(this.globalVars[0].schoolyear)
    //console.log(this.shifteeForm.value)
  }

  onConfirmShift(studentNumber: any) {
    //console.log(this.studentInfoForm.value)
    //console.log(this.shifteeForm.value)
    if(confirm('Are you sure you want to shift the course of this student?')) {
      if(this.studentInfoForm.get('studentNumber').value == null || this.shifteeForm.get('studentnumber').value == null) {
        this.toastr.error('Shiftee course is invalid.')
        window.location.reload()
      }
      else {
        if((studentNumber != this.studentInfoForm.get('studentNumber').value) || (studentNumber != this.shifteeForm.get('studentnumber').value)) {
          this.toastr.error('Please refresh the browser.')
        }
        else {
          this.studentService.addShiftee(this.shifteeForm.value).subscribe()

          this.studentService.editCourse(Number(this.studentInfoForm.get('studentNumber').value), this.studentInfoForm.value).subscribe((res) => {
            if(res) {
              this.variableService.getIpAddress().subscribe((res) => {
                if(res) {
                  let ipAdd = res.clientIp

                  this.processData.get('username').setValue(localStorage.getItem('user'))
                  this.processData.get('ipaddress').setValue(ipAdd)
                  this.processData.get('pcname').setValue(window.location.hostname)
                  this.processData.get('studentnumber').setValue(this.studentInfoForm.get('studentNumber').value)
                  this.processData.get('type').setValue('Shifted Course')
                  this.processData.get('description').setValue(
                    `Shifted ${this.studentInfoForm.get('studentNumber').value}'s
                    from ${this.shifteeForm.get('coursefrom').value} to ${this.shifteeForm.get('coursefrom').value}`)
                  this.variableService.addProcess(this.processData.value).subscribe()
                }
              })

              this.toastr.success(res.message)
              this.students = []
              this.getStudents()
            }
          })
        }
      }
    }
  }

  fileChangeListener($event: any) {
    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' ||
    this.header === true;

    this.csvParser
    .parse(files[0], {
      header: this.header,
      delimiter: ',',
      encoding: 'utf8'
    })
    .pipe()
    .subscribe({
      next: (result): void => {
        //console.log('Result:', result);
        this.csvRecords = result;
        //console.log(this.csvRecords);
      },
      error: (error: NgxCSVParserError) => {
        console.log('Error:', error)
      }
    })
  }

  importStudents() {
    if(confirm("Are you sure you want to import this data?")) {
      if(this.csvRecords == null) {
        alert("No data imported.");
        window.location.reload();
      }
      else{
        for (let i = 0; i < this.csvRecords.length; i++) {
          this.studentService.addStudent(this.csvRecords[i]).pipe().subscribe((res) => {
            if(res) {
              this.variableService.getIpAddress().subscribe((res) => {
                if(res) {
                  let ipAdd = res.clientIp

                  this.processData.get('username').setValue(localStorage.getItem('user'))
                  this.processData.get('ipaddress').setValue(ipAdd)
                  this.processData.get('pcname').setValue(window.location.hostname)
                  this.processData.get('studentnumber').setValue(this.csvRecords[i].studentnumber)
                  this.processData.get('type').setValue('Add Student')
                  this.processData.get('description').setValue(`Added ${this.csvRecords[i].studentnumber} to the database`)
                  this.variableService.addProcess(this.processData.value).subscribe()
                }
              })


              if(i == this.csvRecords.length - 1) {
                this.toastr.success(res.message);
              }
            }
          });
        }
        this.toastr.success('Students Added Successfully.')
        this.getStudents()
      }
    }
    else {
      window.location.reload()
    }
  }

  downloadTemplate() {
    let columns = [
      'studentNumber',
      'firstName',
      'lastName',
      'middleName',
      'suffix',
      'street',
      'barangay',
      'municipality',
      'province',
      'dateOfBirth',
      'gender',
      'religion',
      'citizenship',
      'status',
      'guardian',
      'mobilePhone',
      'email',
      'yearAdmitted',
      'SemesterAdmitted',
      'course',
      'cardNumber',
      'studentincrement',
      'lastupdate',
      'highschool',
      'curriculumid',
    ]

    let options = {
      headers: columns,
      showLabels: true
    }

    new ngxCsv({}, 'student-list-Template', options)
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
