import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-assessed-list',
  templateUrl: './assessed-list.component.html',
  styleUrls: ['./assessed-list.component.scss']
})

export class AssessedListComponent implements OnInit {
  globalVars: any

  // TABLE COLUMNS //
  columns: string[] = [
    'studentnumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'scholarship',
    'enrollStatus',
    'validate'
  ]

  // LISTS OF ASSESSED AND VALIDATED STUDENTS FOR COMPARISON //
  scholarshipList: any = []
  studScholarship = ''
  courseList: any = []


  assessedStuds: Array<any> = []
  assessedListFinal: Array<any> = []

  validatedStuds: any = []

  // FOR LOGGINGGG OF ACTION //
  processData: any


  // ENROLLMENT STATUS CHECKER //
  isValidated: boolean[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private reportService: ReportService,
    private userService: UserService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
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

  initData() {
    let validatedStatus = { validatedStatus: true }
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVars = res.legend
        //console.log(this.globalVars)

        if(this.userService.getToken() != 'UNIV') {
          this.enrollmentService.getAllAssessed(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
            if(res) {
              let tmpData = res.assessedStuds

              for (let i = 0; i < tmpData.length; i++) {
                this.assessedStuds.push(tmpData[i])
              }
              //console.log(this.assessedStuds)

              this.reportService.getCourses(this.userService.getToken()).subscribe((res) => {
                if(res) {
                  this.courseList = res.course

                  this.enrollmentService.getStudsEnroll(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
                    if(res) {
                      let tmpData = res.studsEnroll

                      for (let i = 0; i < tmpData.length; i++) {
                        this.validatedStuds.push(tmpData[i])
                      }
                      //console.log(this.validatedStuds)

                      for (let i = 0; i < this.assessedStuds.length; i++) {
                        if(this.validatedStuds.find((item: any) => item.studentnumber === this.assessedStuds[i].studentnumber)) {
                          validatedStatus.validatedStatus = true
                        }
                        else {
                          validatedStatus.validatedStatus = false
                        }

                        this.assessedListFinal.push(Object.assign({
                          studentnumber: this.assessedStuds[i].studentnumber,
                          scholarship: this.assessedStuds[i].scholarship
                        }, validatedStatus))
                      }

                      for (let i = 0; i < this.assessedListFinal.length; i++) {
                        this.studentService.getStudent(this.assessedListFinal[i].studentnumber).subscribe((res) => {
                          if(res) {
                            let tmpData = res.student

                            this.assessedListFinal[i] = Object.assign(this.assessedListFinal[i],
                              {
                                firstName: tmpData.firstName,
                                middleName: tmpData.middleName,
                                lastName: tmpData.lastName,
                                suffix: tmpData.suffix,
                                course: tmpData.course
                            })


                            if(this.courseCheck(this.assessedListFinal[i].course)) {
                              this.assessedListFinal.splice(i, 1)

                            }
                            console.log(this.assessedListFinal)

                            this.enrollmentService.getScholarships().subscribe((res) => {
                              if(res) {
                                let tmpData = res.scholarships

                                for (let j = 0; j < tmpData.length; j++) {
                                  this.scholarshipList.push(tmpData[j].scholarship)
                                  try {
                                    if(tmpData[j].scholarship == this.assessedListFinal[i].scholarship) {
                                      this.studScholarship = this.assessedListFinal[i].scholarship
                                      //console.log(this.studScholarship)
                                    }
                                  } catch (error) {
                                    continue
                                  }

                                  if(this.userService.getToken() != 'UNIV') {
                                    this.dataSource = new MatTableDataSource(this.assessedListFinal)
                                    this.dataSource.paginator = this.paginator
                                    this.dataSource.sort = this.sort
                                  }
                                }
                              }
                            })

                            if(this.userService.getToken() == 'UNIV') {
                              this.dataSource = new MatTableDataSource(this.assessedListFinal)
                              this.dataSource.paginator = this.paginator
                              this.dataSource.sort = this.sort
                            }
                          }
                        })
                      }
                    }
                    else {
                      for (let i = 0; i < this.assessedStuds.length; i++) {
                        if(this.validatedStuds.find((item: any) => item.studentnumber === this.assessedStuds[i].studentnumber)) {
                          validatedStatus.validatedStatus = true
                        }
                        else {
                          validatedStatus.validatedStatus = false
                        }

                        this.assessedListFinal.push(Object.assign({
                          studentnumber: this.assessedStuds[i].studentnumber,
                          scholarship: this.assessedStuds[i].scholarship
                        }, validatedStatus))
                      }

                      for (let i = 0; i < this.assessedListFinal.length; i++) {
                        this.studentService.getStudent(this.assessedListFinal[i].studentnumber).subscribe((res) => {
                          if(res) {
                            let tmpData = res.student

                            this.assessedListFinal[i] = Object.assign(this.assessedListFinal[i],
                              {
                                firstName: tmpData.firstName,
                                middleName: tmpData.middleName,
                                lastName: tmpData.lastName,
                                suffix: tmpData.suffix,
                                course: tmpData.course
                            })

                            if(this.courseCheck(this.assessedListFinal[i].course)) {
                              this.assessedListFinal.splice(i, 1)
                            }

                            this.enrollmentService.getScholarships().subscribe((res) => {
                              if(res) {
                                let tmpData = res.scholarships

                                for (let j = 0; j < tmpData.length; j++) {
                                  this.scholarshipList.push(tmpData[j].scholarship)
                                  if(tmpData[j].scholarship == this.assessedListFinal[i].scholarship) {
                                    this.studScholarship = this.assessedListFinal[i].scholarship
                                    //console.log(this.studScholarship)
                                  }
                                }

                                this.dataSource = new MatTableDataSource(this.assessedListFinal)
                                this.dataSource.paginator = this.paginator
                                this.dataSource.sort = this.sort
                              }
                            })

                            this.dataSource = new MatTableDataSource(this.assessedListFinal)
                            this.dataSource.paginator = this.paginator
                            this.dataSource.sort = this.sort
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }
        else {
          this.enrollmentService.getAllAssessed(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
            if(res) {
              let tmpData = res.assessedStuds

              for (let i = 0; i < tmpData.length; i++) {
                this.assessedStuds.push(tmpData[i])
              }
              //console.log(this.assessedStuds)

              this.reportService.getCourses('ALL').subscribe((res) => {
                if(res) {
                  this.courseList = res.course

                  this.enrollmentService.getStudsEnroll(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
                    if(res) {
                      let tmpData = res.studsEnroll

                      for (let i = 0; i < tmpData.length; i++) {
                        this.validatedStuds.push(tmpData[i])
                      }
                      //console.log(this.validatedStuds)

                      for (let i = 0; i < this.assessedStuds.length; i++) {
                        if(this.validatedStuds.find((item: any) => item.studentnumber === this.assessedStuds[i].studentnumber)) {
                          validatedStatus.validatedStatus = true
                        }
                        else {
                          validatedStatus.validatedStatus = false
                        }

                        this.assessedListFinal.push(Object.assign({
                          studentnumber: this.assessedStuds[i].studentnumber,
                          scholarship: this.assessedStuds[i].scholarship
                        }, validatedStatus))
                      }

                      for (let i = 0; i < this.assessedListFinal.length; i++) {
                        this.studentService.getStudent(this.assessedListFinal[i].studentnumber).subscribe((res) => {
                          if(res) {
                            let tmpData = res.student

                            this.assessedListFinal[i] = Object.assign(this.assessedListFinal[i],
                              {
                                firstName: tmpData.firstName,
                                middleName: tmpData.middleName,
                                lastName: tmpData.lastName,
                                suffix: tmpData.suffix,
                                course: tmpData.course
                            })

                            //console.log(this.assessedListFinal)

                            this.enrollmentService.getScholarships().subscribe((res) => {
                              if(res) {
                                let tmpData = res.scholarships

                                for (let j = 0; j < tmpData.length; j++) {
                                  this.scholarshipList.push(tmpData[j].scholarship)
                                  try {
                                    if(tmpData[j].scholarship == this.assessedListFinal[i].scholarship) {
                                      this.studScholarship = this.assessedListFinal[i].scholarship
                                      //console.log(this.studScholarship)
                                    }
                                  } catch (error) {
                                    continue
                                  }

                                  this.dataSource = new MatTableDataSource(this.assessedListFinal)
                                  this.dataSource.paginator = this.paginator
                                  this.dataSource.sort = this.sort
                                }
                              }
                            })
                          }
                        })
                      }


                    }

                    else {
                      for (let i = 0; i < this.assessedStuds.length; i++) {
                        if(this.validatedStuds.find((item: any) => item.studentnumber === this.assessedStuds[i].studentnumber)) {
                          validatedStatus.validatedStatus = true
                        }
                        else {
                          validatedStatus.validatedStatus = false
                        }

                        this.assessedListFinal.push(Object.assign({
                          studentnumber: this.assessedStuds[i].studentnumber,
                          scholarship: this.assessedStuds[i].scholarship
                        }, validatedStatus))
                      }

                      for (let i = 0; i < this.assessedListFinal.length; i++) {
                        this.studentService.getStudent(this.assessedListFinal[i].studentnumber).subscribe((res) => {
                          if(res) {
                            let tmpData = res.student

                            this.assessedListFinal[i] = Object.assign(this.assessedListFinal[i],
                              {
                                firstName: tmpData.firstName,
                                middleName: tmpData.middleName,
                                lastName: tmpData.lastName,
                                suffix: tmpData.suffix,
                                course: tmpData.course
                            })

                            this.enrollmentService.getScholarships().subscribe((res) => {
                              if(res) {
                                let tmpData = res.scholarships

                                for (let j = 0; j < tmpData.length; j++) {
                                  this.scholarshipList.push(tmpData[j].scholarship)
                                  if(tmpData[j].scholarship == this.assessedListFinal[i].scholarship) {
                                    this.studScholarship = this.assessedListFinal[i].scholarship
                                    //console.log(this.studScholarship)
                                  }
                                }

                                this.dataSource = new MatTableDataSource(this.assessedListFinal)
                                this.dataSource.paginator = this.paginator
                                this.dataSource.sort = this.sort
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }

      }
    })
  }

  courseCheck(course: any) {
    return !this.courseList.find((item: any) => item.courseCode === course)
  }

  setScholarship(value: any) {
    this.studScholarship = value
    //console.log(this.studScholarship)
  }

  initValidate(studentnumber: any, semester: any, schoolyear: any, scholarship: any) {
    if(confirm('Are you sure you want to validate this student?')) {
      this.enrollmentService.getAssessedStudent(studentnumber, semester, schoolyear).subscribe((res) => {
        if(res) {
          let tmpData = res.assessedStud
          if(tmpData.scholarship == scholarship) {
            this.enrollmentService.addValidateStudent(studentnumber, semester, schoolyear).subscribe((res) => {
              if(res) {
                this.assessedStuds = []
                this.validatedStuds = []
                this.assessedListFinal = []
                this.initData()
                this.toastr.success('Validation successful.')
              }
            })
          }
          else {
            let scholarshipData = { scholarship: scholarship }
            this.enrollmentService.editScholarship(studentnumber, semester, schoolyear, scholarshipData).subscribe((res) => {
              if(res) {
                this.enrollmentService.addValidateStudent(studentnumber, semester, schoolyear).subscribe((res) => {
                  if(res) {
                    this.assessedStuds = []
                    this.validatedStuds = []
                    this.assessedListFinal = []
                    this.initData()
                    this.toastr.success('Validation successful.')
                  }
                })
              }
            })
          }
        }
      })

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
