import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap, map, Observable, Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  baseUrl = environment.apiBaseUrl
  auth: any
  legend: any
  users: any

  constructor(
    private router: Router,
    private userService: UserService,
    private varService: VariableService,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {
    this.installCheck();
  }

  ngOnInit(): void {
    this.auth = localStorage.getItem('token');

    if (this.auth) {
      // CHECKS IF THERE IS A LOGGED USER
      this.router.navigate(['/dashboard']);
    }
  }

  installCheck() {
    this.varService.getLegend().subscribe((res) => {
      if(!res) {
        this.legend = undefined
        this.router.navigate(['install'])
      }
      else {
        this.legend = res.legend;
      }
    });

    this.userService.getAllUsers().subscribe((res) => {
      if(!res) {
        this.users = undefined
        this.router.navigate(['account/add'])
      }
      else {
        this.users = res.users;
      }
      //console.log(users)

    })
  }
}
