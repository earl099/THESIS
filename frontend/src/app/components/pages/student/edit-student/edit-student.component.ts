import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  angForm: any;
  linkStudentNumber: number;
  student: any = [];


  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.linkStudentNumber = Number(this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString());
  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      studentNumber: new FormControl({ value: this.student.studentNumber, disabled: true }),
      firstName: new FormControl({ value: this.student.firstName, disabled: false }, Validators.required),
      middleName: new FormControl({ value: this.student.middleName, disabled: false }),
      lastName: new FormControl({ value: this.student.lastName, disabled: false }, Validators.required),
      suffix: new FormControl({ value: this.student.suffix, disabled: false }),
      street: new FormControl({ value: this.student.suffix, disabled: false }, Validators.required),
      barangay: new FormControl({ value: this.student.barangay, disabled: false }, Validators.required),
      municipality: new FormControl({ value: this.student.municipality, disabled: false }, Validators.required),
      province: new FormControl({ value: this.student.province, disabled: false }, Validators.required),
      dateOfBirth: new FormControl({ value: this.student.dateOfBirth, disabled: false }, Validators.required),
      gender: new FormControl({ value: this.student.gender, disabled: false }, Validators.required),
      religion: new FormControl({ value: this.student.religion, disabled: false }, Validators.required),
      citizenship: new FormControl({ value: this.student.citizenship, disabled: false }, Validators.required),
      status: new FormControl({ value: this.student.status, disabled: false }, Validators.required),
      guardian: new FormControl({ value: this.student.guardian, disabled: false }, Validators.required),
      mobilePhone: new FormControl({ value: this.student.mobilePhone, disabled: false }, Validators.required),
      email: new FormControl({ value: this.student.email, disabled: false }, Validators.required),
      course: new FormControl({ value: this.student.course, disabled: false }, Validators.required)
    });

    this.getStudent();
  }

  getStudent() {
    this.studentService.getStudent(this.linkStudentNumber).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        console.log(res.student)
        this.student = res.student;
        this.angForm = this.fb.group({
          studentNumber: new FormControl({ value: this.student.studentNumber, disabled: true }),
          firstName: new FormControl({ value: this.student.firstName, disabled: false }, Validators.required),
          middleName: new FormControl({ value: this.student.middleName, disabled: false }),
          lastName: new FormControl({ value: this.student.lastName, disabled: false }, Validators.required),
          suffix: new FormControl({ value: this.student.suffix, disabled: false }),
          street: new FormControl({ value: this.student.street, disabled: false }, Validators.required),
          barangay: new FormControl({ value: this.student.barangay, disabled: false }, Validators.required),
          municipality: new FormControl({ value: this.student.municipality, disabled: false }, Validators.required),
          province: new FormControl({ value: this.student.province, disabled: false }, Validators.required),
          dateOfBirth: new FormControl({ value: this.student.dateOfBirth, disabled: false }, Validators.required),
          gender: new FormControl({ value: this.student.gender, disabled: false }, Validators.required),
          religion: new FormControl({ value: this.student.religion, disabled: false }, Validators.required),
          citizenship: new FormControl({ value: this.student.citizenship, disabled: false }, Validators.required),
          status: new FormControl({ value: this.student.status, disabled: false }, Validators.required),
          guardian: new FormControl({ value: this.student.guardian, disabled: false }, Validators.required),
          mobilePhone: new FormControl({ value: this.student.mobilePhone, disabled: false }, Validators.required),
          email: new FormControl({ value: this.student.email, disabled: false }, Validators.required),
          course: new FormControl({ value: this.student.course, disabled: false }, Validators.required)
        });
      }
    })
  }

  onEditStudent(studentNumber: number, angForm: any) {
    if(confirm('Are you sure you want to edit this student\'s details?')){
      //console.log(angForm.value);
      this.studentService.editStudent(studentNumber, angForm.value).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message);
          //console.log(res.student);
          alert('Student updated successfully.');
          this.router.navigate([`/student/profile/${studentNumber}`]);
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
