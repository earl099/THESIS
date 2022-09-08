import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'enrollmentSystem-frontend';

  sidebarOpen = false;

  ngOnInit(){}

  sidebarToggler() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
