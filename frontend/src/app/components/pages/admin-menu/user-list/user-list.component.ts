import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {


  users: any;
  columns: string[] = [
    'collegeID',
    'username',
    'email',
    'isAdmin',
    'edit',
    'delete'
  ]

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
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
        //console.log(this.users);
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



  redirectTo(user: User): void {
    this.router.navigate(['account/profile/' + user.collegeID]);
  }
}
