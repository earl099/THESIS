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

  //--- GET SCHOOLYEAR FOR REPORT TYPE ---//
  getSchoolYearbyReportType(type: string): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/${type}/get/schoolyear`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get School Year')))
  }

  //--- SEARCH STUDENTS ENROLLED ---//
  advSearchByReportType(type: any, data: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/report/${type}`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Search Operation')))
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
