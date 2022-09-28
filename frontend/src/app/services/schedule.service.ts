import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  redirectUrl!: string;
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
  };
  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  //--- ADD SCHEDULE FUNCTION ---//
  addSchedule(scheduleData: any): Observable<any> {
    return this.httpClient
    .post(
      `${this.baseUrl}/schedule/add`, scheduleData, this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Add Schedule'))
    );
  }

  //--- SCHEDULE LIST FUNCTION ---//
  getAllSchedules(): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/schedule/list`,
      { params: {page: 1, size: 50} }
    )
    .pipe(
      catchError(this.handleError<any>('Get Schedules'))
    );
  }

  //--- SCHEDULE PROFILE FUNCTION ---//
  getSchedule(schedcode: any): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/schedule/${schedcode}`,
      this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Get Schedule'))
    );
  }

  //--- SCHEDULE MODIFICATION FUNCTION ---//
  editSchedule(schedcode: any, scheduleData: any): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}/schedule/edit/:schedcode`,
      scheduleData,
      this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Edit Schedule'))
    )
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
