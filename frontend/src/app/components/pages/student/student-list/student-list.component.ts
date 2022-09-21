import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  columns: string[] = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'course',
    'edit'
  ];


  students: any = [];

  constructor(
    private studentService: StudentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getStudents();
  }

  redirectTo(student: any): void {
    this.router.navigate(['student/profile/' + student.studentNumber]);
  }

  getStudents() {
    this.studentService.getAllStudents().subscribe((res) => {
      if(res) {
        this.toastr.success(res.message)
        this.students = res.students;
        console.log(this.students)
      }
    })
  }
}
