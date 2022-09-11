import { Injectable, Output, EventEmitter } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/models/User';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  redirectUrl!: string;
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  //---ADD USER ---//
  addUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/account/add`,
    userData, this.httpOptions).pipe(
      catchError(this.handleError<any>("Create User"))
    );
  }

  //--- ADMIN LOGIN ---//
  adminLogin(userData: any) {
    return this.httpClient.post(`${this.baseUrl}/login/admin`, userData, this.httpOptions)
    .pipe(catchError(this.handleError<any>("Admin Login")));
  }

  //--- USER LOGIN ---//
  userLogin(userData: any) {
    return this.httpClient.post(`${this.baseUrl}/login/user`, userData, this.httpOptions)
    .pipe(catchError(this.handleError<any>("User Login")));
  }

  //--- GET USERS ---//
  getAllUsers(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/admin/user/list`, { params: { page: 1, size: 50 } })
    .pipe(catchError(this.handleError<any>('Get Users')))
  }

  getUser(collegeID: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/admin/user/${collegeID}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get User')));
  }

  //--- EDIT USER ---//
  editUser(user: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/admin/user/edit/${user.collegeID}`, user, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit User')));
  }

  //--- DELETE USER ---//
  deleteUser(collegeID: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/admin/user/delete/${collegeID}`)
  }

  //--- ERROR HANDLERS ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }

  //TOKEN FUNCTIONS
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  deleteToken(){
    localStorage.clear();
  }

  isLoggedIn(){
    const userToken = this.getToken();
    if(userToken != null) {
      return true;
    }
    else{
      return false;
    }
  }


}
