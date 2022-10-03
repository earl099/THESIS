import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  students: any = [];
  dataSource!: MatTableDataSource<any>;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    
  }

  ngOnInit(): void {
    this.getStudents();
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
