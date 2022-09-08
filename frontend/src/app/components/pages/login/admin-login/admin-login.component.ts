import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubjectsService } from 'src/app/services/subjects.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private dataService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private subjectsService: SubjectsService
  ) { }

  adminLogin() {

    this.dataService.adminLogin(this.loginForm.value)
    .subscribe({
      next: (res) => {
        console.log(res);
        if(res) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.dataService.setToken(res.user.collegeID);
          localStorage.setItem('expirationDuration', res.expirationDuration);

          const expiration: number = +localStorage.getItem('expirationDuration')!;
          this.subjectsService.setUserLoginStatus(true);
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

