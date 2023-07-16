import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  processData: any

  angForm: any;
  linkStudentNumber: number;
  student: any = [];


  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private variableService: VariableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.linkStudentNumber = Number(this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString());
  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      studentNumber: new FormControl({ value: '', disabled: false }),
      firstName: new FormControl({ value: '', disabled: false }, Validators.required),
      middleName: new FormControl({ value: '', disabled: false }),
      lastName: new FormControl({ value: '', disabled: false }, Validators.required),
      suffix: new FormControl({ value: '', disabled: false }),
      street: new FormControl({ value: '', disabled: false }, Validators.required),
      barangay: new FormControl({ value: '', disabled: false }, Validators.required),
      municipality: new FormControl({ value: '', disabled: false }, Validators.required),
      province: new FormControl({ value: '', disabled: false }, Validators.required),
      dateOfBirth: new FormControl({ value: '', disabled: false }, Validators.required),
      gender: new FormControl({ value: '', disabled: false }, Validators.required),
      religion: new FormControl({ value: '', disabled: false }, Validators.required),
      citizenship: new FormControl({ value: '', disabled: false }, Validators.required),
      status: new FormControl({ value: '', disabled: false }, Validators.required),
      guardian: new FormControl({ value: '', disabled: false }, Validators.required),
      mobilePhone: new FormControl({ value: '', disabled: false }, Validators.required),
      email: new FormControl({ value: '', disabled: false }, Validators.required),
      highschool: new FormControl({ value: '', disabled: false }, Validators.required)
    });

    this.processData = this.fb.group({
      username: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false }),
      pcname: new FormControl({ value: '', disabled: false }),
      studentnumber: new FormControl({ value: '', disabled: false }),
      type: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false })
    })

    this.getStudent();
  }

  getStudent() {
    this.studentService.getStudent(this.linkStudentNumber).subscribe((res) => {
      if(res) {
        //console.log(res.student)
        this.student = res.student;

        this.angForm.get('studentNumber').setValue(this.student.studentNumber)
        this.angForm.get('firstName').setValue(this.student.firstName)
        this.angForm.get('middleName').setValue(this.student.middleName)
        this.angForm.get('lastName').setValue(this.student.lastName)
        this.angForm.get('suffix').setValue(this.student.suffix)
        this.angForm.get('street').setValue(this.student.street)
        this.angForm.get('barangay').setValue(this.student.barangay)
        this.angForm.get('municipality').setValue(this.student.municipality)
        this.angForm.get('province').setValue(this.student.province)
        this.angForm.get('dateOfBirth').setValue(this.student.dateOfBirth)
        this.angForm.get('gender').setValue(this.student.gender)
        this.angForm.get('religion').setValue(this.student.religion)
        this.angForm.get('citizenship').setValue(this.student.citizenship)
        this.angForm.get('status').setValue(this.student.status)
        this.angForm.get('guardian').setValue(this.student.guardian)
        this.angForm.get('mobilePhone').setValue(this.student.mobilePhone)
        this.angForm.get('email').setValue(this.student.email)
        this.angForm.get('highschool').setValue(this.student.highschool)
      }
    })
  }

  onEditStudent() {
    console.log(this.angForm.value)
    if(confirm('Are you sure you want to edit this student\'s details?')){

      //--- CONVERTING TO UPPERCASE ---//
      this.angForm.get('firstName').setValue(String(this.angForm.get('firstName').value).toUpperCase());
      this.angForm.get('middleName').setValue(String(this.angForm.get('middleName').value).toUpperCase());
      this.angForm.get('lastName').setValue(String(this.angForm.get('lastName').value).toUpperCase());
      this.angForm.get('suffix').setValue(String(this.angForm.get('suffix').value).toUpperCase());
      this.angForm.get('street').setValue(String(this.angForm.get('street').value).toUpperCase());
      this.angForm.get('barangay').setValue(String(this.angForm.get('barangay').value).toUpperCase());
      this.angForm.get('municipality').setValue(String(this.angForm.get('municipality').value).toUpperCase());
      this.angForm.get('province').setValue(String(this.angForm.get('province').value).toUpperCase());
      this.angForm.get('religion').setValue(String(this.angForm.get('religion').value).toUpperCase());
      this.angForm.get('citizenship').setValue(String(this.angForm.get('citizenship').value).toUpperCase());
      this.angForm.get('status').setValue(String(this.angForm.get('status').value).toUpperCase());
      this.angForm.get('guardian').setValue(String(this.angForm.get('guardian').value).toUpperCase());
      console.log(this.angForm.value);

      this.studentService.editStudent(Number(this.angForm.get('studentNumber').value), this.angForm.value).subscribe((res) => {
        if(res) {
          this.variableService.getIpAddress().subscribe((res) => {
            if(res) {
              let ipAdd = res.clientIp

              this.processData.get('username').setValue(localStorage.getItem('user'))
              this.processData.get('ipaddress').setValue(ipAdd)
              this.processData.get('pcname').setValue(window.location.hostname)
              this.processData.get('studentnumber').setValue(this.angForm.get('studentNumber').value)
              this.processData.get('type').setValue('Edit Student Details')
              this.processData.get('description').setValue(`Edited ${this.angForm.get('studentNumber').value}'s details to the database`)
              this.variableService.addProcess(this.processData.value).subscribe()
            }
          })

          this.toastr.success(res.message);
          //console.log(res.student);
          this.router.navigate([`/dashboard`]);
        }
        else{
          console.log(res);
        }
      })
    }
    else {
      window.location.reload();
    }
  }
}
