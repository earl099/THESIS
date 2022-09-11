import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})

export class UserPageComponent implements OnInit {
  collegeID: string;
  identifiers: string[] = [
    'College ID',
    'User Name',
    'Password',
    'Email',
    'Admin Account'
  ];
  user: any = [];
  newPassword = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private toastr: ToastrService) {
    this.collegeID = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString();
    //console.log(this.collegeID);
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.collegeID).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.user = res.user;
        this.newPassword = this.user.password.toString();
        this.newPassword = this.newPassword.replace(/./g, '*');
        this.newPassword = this.newPassword.substring(0, 8);
      }
    })
  }

  onDeleteUser(collegeID: string) {
    if(confirm('Are you sure you want to delete the user?')) {
      return this.userService.deleteUser(collegeID).subscribe((res) => {
        if(res) {
          let index = this.user.findIndex((u: any) => u.collegeID === collegeID);
          if(index > -1) {
            this.user.splice(index, 1);
            this.toastr.success(res.message);
          }
        }
      });
    }
    else {
      window.location.reload();
    }

  }
}
