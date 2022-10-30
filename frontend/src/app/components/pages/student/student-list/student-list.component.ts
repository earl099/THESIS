import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurriculumService } from 'src/app/services/curriculum.service';

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
    'edit',
    'shiftTo',
    'confirmShift'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //--- DATA FOR DISPLAYING IN THE LIST ---//
  curricula: any = [];
  students: any = [];

  //--- FORMS FOR INSERTING TO THE DATABASE ---//
  shifteeForm: any;
  studentInfoForm: any;
  dataSource!: MatTableDataSource<any>;

  constructor(
    private studentService: StudentService,
    private curriculumService: CurriculumService,
    private router: Router,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngOnInit(): void {
    this.getStudents();
    this.getCurricula();
  }

  redirectTo(student: any): void {
    this.router.navigate([`student/profile/${student.studentNumber}`]);
  }

  getStudents() {
    this.studentService.getAllStudents().subscribe((res) => {
      if(res) {
        this.toastr.success(res.message)
        this.students = res.students;
        this.dataSource = new MatTableDataSource(this.students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.students)
      }
    })
  }

  getCurricula() {
    this.curriculumService.getCurricula().subscribe((res) => {
      if(res) {
        this.curricula = res.curricula;
        //console.log(this.curricula)
      }
    })
  }

  onConfirmShift() {

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
