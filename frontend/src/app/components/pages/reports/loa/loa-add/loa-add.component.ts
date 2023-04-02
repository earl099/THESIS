import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-loa-add',
  templateUrl: './loa-add.component.html',
  styleUrls: ['./loa-add.component.scss']
})
export class LoaAddComponent implements OnInit {
  globalVar: any
  addLoaForm: any
  studList!: Array<any>
  enrolledStuds: any

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private variableService: VariableService,
    private router: Router,
    private toastr: ToastrService
  ) { }

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
                    this.router.navigateByUrl('/report/loa/list')
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
}
