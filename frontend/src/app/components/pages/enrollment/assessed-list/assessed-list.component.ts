import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
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
    'enrollStatus',
    'validate'
  ]

  // LISTS OF ASSESSED AND VALIDATED STUDENTS FOR COMPARISON //
  assessedStuds: any = []
  assessedListFinal: any = []

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
    private variableService: VariableService,
    private fb: FormBuilder,
    private router: Router,
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
        this.enrollmentService.getAllAssessed(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
          if(res) {
            let tmpData = res.assessedStuds

            for (let i = 0; i < tmpData.length; i++) {
              this.assessedStuds.push(tmpData[i])
            }

            this.enrollmentService.getStudsEnroll(this.globalVars[0].semester, this.globalVars[0].schoolyear).subscribe((res) => {
              if(res) {
                let tmpData = res.studsEnroll

                for (let i = 0; i < tmpData.length; i++) {
                  this.validatedStuds.push(tmpData[i])
                }

                for (let i = 0; i < this.assessedStuds.length; i++) {
                  for (let j = 0; j < this.validatedStuds.length; j++) {
                    if(this.assessedStuds[i].studentnumber == this.validatedStuds[j].studentnumber) {
                      validatedStatus.validatedStatus = true
                      this.assessedListFinal.push(Object.assign({ studentnumber: this.assessedStuds[i].studentnumber }, validatedStatus))
                    }
                    else {
                      validatedStatus.validatedStatus = false
                      this.assessedListFinal.push(Object.assign({ studentnumber: this.assessedStuds[i].studentnumber }, validatedStatus))
                    }
                  }
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
                          suffix: tmpData.suffix
                      })
                    }
                  })
                }

                this.dataSource = new MatTableDataSource(this.assessedListFinal)
                this.dataSource.paginator = this.paginator
                this.dataSource.sort = this.sort
              }
              else {
                for (let i = 0; i < this.assessedStuds.length; i++) {
                  validatedStatus.validatedStatus = false
                  this.assessedListFinal.push(Object.assign({ studentnumber: this.assessedStuds[i].studentnumber }, validatedStatus))
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
                          suffix: tmpData.suffix
                      })
                    }
                  })
                }

                this.dataSource = new MatTableDataSource(this.assessedListFinal)
                this.dataSource.paginator = this.paginator
                this.dataSource.sort = this.sort
              }
            })
          }
        })
      }
    })
  }

  initValidate(studentnumber: any, semester: any, schoolyear: any) {
    if(confirm('Are you sure you want to validate this student?')) {
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
