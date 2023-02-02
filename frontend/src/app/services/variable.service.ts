import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VariableService {
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
  }

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  //--- ADD GLOBAL VARIABLE ---//
  addLegend(legend: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/legend/add`, legend, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Global Variables')))
  }

  //--- GET GLOBAL VARIABLE ---//
  getLegend(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/legend/list`)
    .pipe(catchError(this.handleError<any>('Get Global Variables')))
  }

  //--- EDIT GLOBAL VARIABLE ---//
  editLegend(legend: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/legend/edit`, legend, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit Global Variables')))
  }

  //--- ADDING LOGS ---//
  addProcess(processData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/log/process/add`, processData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Process Log')))
  }

  //--- GETTING THE IP ADDRESS ---//
  getIpAddress(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/get/ip`)
    .pipe(catchError(this.handleError<any>('Get IP Address')))
  }

  //--- ERROR HANDLERS ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
