import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  adminLogin() {

    this.userService.adminLogin(this.loginForm.value)
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
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

}

