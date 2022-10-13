import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() sidebarStatus: EventEmitter<any> = new EventEmitter();

  adminLogoutBtn: boolean;
  loginBtn: boolean;
  logoutBtn: boolean;

  constructor(private dataService: UserService, private router: Router) {
    this.sidebarStatus.emit();
    this.sidebarStatus.subscribe(status => this.changeState(status, this.dataService.getToken()));
    if(this.dataService.isLoggedIn()){
      if(this.dataService.getToken() == 'UNIV'){
        this.loginBtn = false;
        this.adminLogoutBtn = true;
        this.logoutBtn = true;
      }
      else{
        this.loginBtn = false;
        this.adminLogoutBtn = false;
        this.logoutBtn = true;
      }
    }
    else{
      this.loginBtn = true;
      this.adminLogoutBtn = false;
      this.logoutBtn = false;
    }
  }

  ngOnInit(): void {
  }



  private changeState(state: boolean, token: string | null) {
    if(token == 'admin'){
      this.adminLogoutBtn = state;
      this.logoutBtn = state;
      this.loginBtn = !state;
    }
    else{
      this.adminLogoutBtn = !state;
      this.logoutBtn = state;
      this.loginBtn = !state;
    }
  }

  logout() {
    this.dataService.deleteToken();
    window.location.href = window.location.href;
  }
}
