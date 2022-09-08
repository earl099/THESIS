import { Component, OnInit } from '@angular/core';
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



  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
  }

  getUsers() {
    this.userService
  }

  redirectTo(user: User): void {
    this.router.navigate(['account/profile/' + user.collegeID]);
  }
}
