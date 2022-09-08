import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor() { }

  public isLoggedInSub = new BehaviorSubject<boolean>(false);
  public isLoggedInBehaviorSub = this.isLoggedInSub.asObservable();

  setUserLoginStatus(status: any) {
    this.isLoggedInSub.next(status);
  }
}
