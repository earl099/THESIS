import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  users: any;
  columns: string[] = [
    'collegeID',
    'username',
    'edit',
    'delete'
  ]
  collegeList: any
  addForm: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private reportService: ReportService,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngOnInit(): void {

    this.addForm = this.fb.group({
      collegeID: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl('', Validators.email),
      password: new FormControl(''),
      isAdmin: new FormControl('')
    })

    this.getUsers();

  }



  getUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      if(res) {
        this.users = res.users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

    this.reportService.getColleges().subscribe((res) => {
      if(res) {
        this.collegeList = res.college
      }
    })
  }

  addUser() {
    if(confirm('Confirm Add?')) {
      if(this.addForm.get('collegeID').value != 'UNIV') {
        this.addForm.get('isAdmin').setValue(false)
      }
      else {
        this.addForm.get('isAdmin').setValue(true)
      }

      for(let i = 0; i < this.users.length; i++) {
        if(
          this.addForm.get('collegeID').value == '' ||
          this.addForm.get('username').value == '' ||
          this.addForm.get('password').value == '' ||
          this.addForm.get('email').value == ''
        )
        {
          this.toastr.error('Please fill out all fields.')
          break
        }

        if(this.addForm.get('collegeID').value == this.users[i].collegeID) {
          this.toastr.error('College account already exists.')
          break
        }
        else {
          if(i == this.users.length - 1) {
            this.userService.addUser(this.addForm.value).subscribe((res) => {
              if(res) {
                this.getUsers()
                this.addForm.get('collegeID').setValue('')
                this.addForm.get('username').setValue('')
                this.addForm.get('email').setValue('')
                this.addForm.get('password').setValue('')
                this.addForm.get('isAdmin').setValue('')
              }
            })
          }
        }
      }
    }
  }

  onDeleteUser(collegeID: string) {
    if(confirm('Are you sure you want to delete the user?')) {
      window.location.reload();
      return this.userService.deleteUser(collegeID).subscribe((res) => {
        if(res) {
          let index = this.users.findIndex((u: any) => u.collegeID === collegeID);
          if(index > -1) {
            this.users.splice(index, 1);
            this.toastr.success(res.message);
          }
        }
      });
    }
    else {
      window.location.reload();
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

  redirectTo(user: any): void {
    this.router.navigate(['account/profile/' + user.collegeID]);
  }
}
