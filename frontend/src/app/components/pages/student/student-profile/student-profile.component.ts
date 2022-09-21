import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
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
    private toastr: ToastrService
  ) {
    this.studentNumber = Number(this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString());
  }

  ngOnInit(): void {
    this.getStudent();
  }

  getStudent() {
    this.studentService.getStudent(this.studentNumber).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.student = res.student;
      }
    });
  }

}
