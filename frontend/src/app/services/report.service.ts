import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  //--- GET COLLEGES ---//
  getColleges(): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/report/colleges/get`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Colleges')))
  }

  //--- GET COURSES BY COLLEGE ---//
  getCourses(college: any): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/report/courses/get/${college}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Courses')))
  }

  //--- GET SCHOOLYEAR FOR REPORT TYPE ---//
  getSchoolYearbyReportType(type: string): Observable<any> {
    if (type == 'stud_enroll') {
      return this.httpClient
      .get(`${this.baseUrl}/${type}/get/schoolyear`, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Get School Year')))
    }
    else if(type == 'shiftee') {
      return this.httpClient
      .get(`${this.baseUrl}/get/${type}/schoolyear`, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Get School Year')))
    }
    else {
      return this.httpClient
      .get(`${this.baseUrl}/get/schoolyear/${type}`, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Get School Year')))
    }

  }

  //--- SEARCH STUDENTS ENROLLED ---//
  advSearchByReportType(type: any, data: any): Observable<any> {
    //if student enrolled
    if(type == 'stud_enroll') {
      return this.httpClient
      .post(`${this.baseUrl}/report/${type}`, data, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Search Operation')))
    }
    else if(type == 'shiftee') {
      return this.httpClient
      .post(`${this.baseUrl}/report/get/${type}`, data, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Search Operation')))
    }
    else {
      return this.httpClient
      .post(`${this.baseUrl}/get/report/${type}`, data, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Search Operation')))
    }
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
