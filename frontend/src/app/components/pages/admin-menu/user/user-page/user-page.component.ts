import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
  user: any;
  newPassword = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.collegeID = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString();
    //console.log(this.collegeID);
  }

  ngOnInit(): void {
    this.user = this.fb.group({
      collegeID: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      isAdmin: new FormControl('')
    })

    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.collegeID).subscribe((res) => {
      if(res) {
        let tmpData = res.user;
        this.newPassword = tmpData.password.toString();
        this.newPassword = this.newPassword.replace(/./g, '*');
        this.newPassword = this.newPassword.substring(0, 8);

        this.user.get('collegeID').setValue(tmpData.collegeID)
        this.user.get('username').setValue(tmpData.username)
        this.user.get('email').setValue(tmpData.email)
        this.user.get('password').setValue(this.newPassword)
        if(!tmpData.isAdmin) {
          this.user.get('isAdmin').setValue('No')
        }
        else {
          this.user.get('isAdmin').setValue('Yes')
        }

      }
    })
  }

  onEditUser(user: any) {
    console.log(user)
    if(confirm('Confirm Edit?')) {
      if(
        user.username == '' ||
        user.password == '' ||
        user.email == ''
      ) {
        this.toastr.error('Please fill out all fields')
      }
      else {
        this.userService.editUser(user.collegeID, user).subscribe((res) => {
          if(res) {
            this.toastr.success('Edit Successful.')
            this.router.navigate(['/account/list'])
          }
        })
      }

    }
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
