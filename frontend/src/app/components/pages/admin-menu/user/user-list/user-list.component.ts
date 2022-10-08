import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngOnInit(): void {
    this.getUsers();
  }



  getUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.users = res.users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
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
