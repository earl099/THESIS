import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  //--- ADD DIVISION OF FEES FUNCTION ---//
  addDivOfFees(feesData: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/fees/add`, feesData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Division of fees')))
  }

  //--- GET DIVISION OF FEES ---//
  getDivOfFees(studentnumber: any, semester: any, schoolyear: any): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/fees/${studentnumber}/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Division of Fees')))
  }

  //--- GET PAID DIVISION OF FEES ---//
  getPaidDivOfFees(studentnumber: any, semester: any, schoolyear: any): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/fees/paid/${studentnumber}/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Paid Fees')))
  }

  //--- EDIT DIVISION OF FEES ---//
  editDivOfFees(
    studentnumber: any,
    semester: any,
    schoolyear: any,
    feesData: any
    ): Observable<any>
    {
      return this.httpClient
      .put(`${this.baseUrl}/fees/edit/${studentnumber}/${semester}/${schoolyear}`, feesData, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Edit Division of Fees')))
  }

  //--- EDIT PAID DIVISION OF FEES ---//
  editPaidDivOfFees(
    studentnumber: any,
    semester: any,
    schoolyear: any,
    feesData: any
    ): Observable<any> {
      return this.httpClient
      .put(`${this.baseUrl}/fees/paid/edit/${studentnumber}/${semester}/${schoolyear}`, feesData, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Edit Paid Fees')))
  }
  
  //--- ERROR HAANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
