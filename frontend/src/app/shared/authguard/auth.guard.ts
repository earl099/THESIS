import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private dataService: UserService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): any {
    //return true;
    const routeUrl: string = state.url;
    return this.isLogin(routeUrl);
  }

  isLogin(routeUrl: string) {
    if(this.dataService.isLoggedIn()) {
      return true;
    }
    else{
      this.dataService.redirectUrl = routeUrl;
      this.router.navigate(['/home'], {queryParams: { returnUrl: routeUrl }});
      return false;
    }

  }
}
