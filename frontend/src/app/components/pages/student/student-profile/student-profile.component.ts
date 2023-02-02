import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  processData: any
  student: any = [];
  identifiers = [
    'Student Number',
    'Name',
    'Course',
    'Address',
    'Sex',
    'Birthday',
    'Status',
    'Religion',
    'Email',
    'Number',
    'Guardian',
  ];
  studentNumber: number
  constructor(
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.studentNumber = Number(this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString());
  }

  ngOnInit(): void {
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
    this.studentService.getStudent(this.studentNumber).subscribe((res) => {
      if(res) {
        this.variableService.getIpAddress().subscribe((res) => {
          if(res) {
            let ipAdd = res.clientIp

            this.processData.get('username').setValue(localStorage.getItem('user'))
            this.processData.get('ipaddress').setValue(ipAdd)
            this.processData.get('pcname').setValue(window.location.hostname)
            this.processData.get('studentnumber').setValue(this.studentNumber)
            this.processData.get('type').setValue('Opened Student Profile')
            this.processData.get('description').setValue(`Opened ${this.studentNumber}'s profile.`)
            this.variableService.addProcess(this.processData).subscribe()
          }
        })

        this.toastr.success(res.message);
        this.student = res.student;
      }
    });
  }

}
