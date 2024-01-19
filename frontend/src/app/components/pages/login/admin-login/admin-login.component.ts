import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm: any;
  userLoginForm: any

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.adminLoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.userLoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    if(localStorage.getItem('token') != null || localStorage.getItem('token') != undefined) {
      this.router.navigate(['/dashboard'])
    }

    this.userService.getAllUsers().subscribe((res) => {
      if(res) {
        let tmpData = res.users
        if(tmpData.length < 1) {
          this.router.navigate(['/install'])
        }
      }
    })
  }

  onLogin(accountType: any) {
    if(this.adminLoginForm.invalid && this.userLoginForm.invalid) {
      return this.toastr.error('Invalid User')
    }
    else {
      switch(accountType) {
        case 'admin':
          this.userService.adminLogin(this.adminLoginForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              if(res) {
                localStorage.setItem('user', res.user.username);
                this.userService.setToken(res.user.collegeID);
                localStorage.setItem('expirationDuration', res.expirationDuration);

                const expiration: number = +localStorage.getItem('expirationDuration')!;
                this.userService.setUserLoginStatus(true);
                this.toastr.success(res.message);
                setTimeout(() => {
                  localStorage.clear();
                  this.router.navigate(['/home']);
                }, +expiration * 1000)
                window.location.href = '/dashboard';
              }
              else {
                alert('Error Logging in.');
                localStorage.clear();
                window.location.reload();
              }

            },

            error: (e) => {
              console.error(e);
            }
          })
          break

        case 'user':
          this.userService.userLogin(this.userLoginForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              if(res) {
                localStorage.setItem('user', JSON.stringify(res.user));
                localStorage.setItem('token', res.user.collegeID);
                localStorage.setItem('expirationDuration', res.expirationDuration);

                const expiration: number = +localStorage.getItem('expirationDuration')!;
                this.userService.setUserLoginStatus(true);
                this.toastr.success(res.message);
                setTimeout(() => {
                  localStorage.clear();
                  this.router.navigate(['/home']);
                }, +expiration * 1000)
                window.location.href = '/dashboard';
              }
              else{
                alert('Error Logging in.');
                localStorage.clear();
                window.location.reload();
              }
            }
          })
          break
      }
    }
  }
}

