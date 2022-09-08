import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginBtn: boolean;
  logoutBtn: boolean;

  @Output() toggleSidebar:EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private dataService: UserService) {

    if(this.dataService.isLoggedIn()){
      dataService.getLoggedInName.subscribe(name => this.changeName(name));
      if(this.dataService.getToken() != null){
        this.loginBtn = false;
        this.logoutBtn = true;
      }
      else{
        this.loginBtn = false;
        this.logoutBtn = true;
      }
    }
    else{
      this.loginBtn = true;
      this.logoutBtn = false;
    }
  }

  ngOnInit(): void {

  }

  getName(): string | null {
    if(this.dataService.getToken() == null) {
      return "User";
    }
    else{
      return this.dataService.getToken();
    }
  }

  toggleSideBar() {
    this.toggleSidebar.emit();
  }

  redirectTo(link: string): void {
    this.router.navigate([link]);
  }

  private changeName(name: boolean) {
    this.logoutBtn = name;
    this.loginBtn = !name;
  }

  logout() {
    this.dataService.deleteToken();
    window.location.href = '/home';
  }
}
