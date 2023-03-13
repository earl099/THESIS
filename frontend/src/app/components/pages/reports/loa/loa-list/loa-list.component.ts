import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-loa-list',
  templateUrl: './loa-list.component.html',
  styleUrls: ['./loa-list.component.scss']
})
export class LoaListComponent implements OnInit {
  columns: string[] = [
    'studentnumber',
    'course',
    'semester',
    'schoolyear',
    'isActive',
    'delete'
  ]

  loaForm: any

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.loaForm = this.fb.group({
      encoder: new FormControl({ value: '', disabled: false }),
      ipaddress: new FormControl({ value: '', disabled: false })
    })

    if(localStorage.getItem('token') == 'UNIV') {
      this.adminSearch()
    }
  }

  adminSearch() {
    this.studentService.adminSearch().subscribe((res) => {
      if(res) {
        let students = res.studsWithLoa
        this.dataSource = new MatTableDataSource(students)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
    })
  }

  userSearch() {
    let collegeID = localStorage.getItem('token')
    this.studentService.userSearch(collegeID).subscribe((res) => {
      let students = res.studsWithLoa
      this.dataSource = new MatTableDataSource(students)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
  }

  deleteLoa(studentnumber: any, data: any) {
    if(confirm('Are you sure you want to remove this record?')) {
      this.variableService.getIpAddress().subscribe((res) => {
        if(res) {
          data.encoder = localStorage.getItem('user')
          data.ipaddress = res.clientIp

          this.studentService.deleteLoa(studentnumber, data).subscribe((res) => {
            if(res) {
              this.toastr.success('Record Deleted.')
              this.router.navigateByUrl('/dashboard')
            }
          })
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
