import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  columns: string[] = [
    'studNum',
    'lrn',
    'fname',
    'mname',
    'lname',
    'degProg',
    'yrLvl',
    'gender',
    'email',
    'contactNum',
    'ftStatus',
    'enrolledStatus',
    'studClass',
    'isShiftee',
    'isOnLeave',
    'collegeID'
  ];


  students: Student[] = [];

  constructor(private studentService: StudentService, activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
  }

  redirectTo(student: Student): void {
    this.router.navigate(['student/profile/' + student.studNum]);
  }
}
