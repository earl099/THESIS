import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

import { first } from 'rxjs/operators';
import { SubjectsService } from 'src/app/services/subjects.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: any;
  constructor(private dataService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private subjectsService: SubjectsService) { }

  userLogin() {
    if(this.loginForm.invalid) { return; }
    this.dataService.userLogin(this.loginForm.value)
    .subscribe({
      next: (res) => {
        console.log(res);
        if(res) {
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.user.collegeID);
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
        else{
          alert('Error Logging in.');
          window.location.reload();
        }

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

