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
    .pipe(catchError(this.handleError<any>('Adding Global Variables')))
  }

  getLegend(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/legend/list`)
    .pipe(catchError(this.handleError<any>('Getting Global Variables')))
  }

  //--- ERROR HANDLERS ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
