import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  baseURL = environment.apiBaseUrl
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  //--- GET GRADES BY STUDNUM, SEM, AND SY ---//
  getGradeByStudNumSemSY(
    studentnumber: any,
    semester: any,
    schoolyear: any
    ): Observable<any> {
      return this.httpClient.get(`${this.baseURL}/grades/${studentnumber}/${semester}/${schoolyear}`, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Get Grades')))
  }

  //--- GET GRADES BY SCHEDCODE, SUBJCODE AND STUDNUM ---//
  getGradeBySchedCodeSubjCodeAndStudNum(
    schedcode: any,
    subjectcode: any,
    studentnumber: any
  ): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/grades/get/${schedcode}/${subjectcode}/${studentnumber}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Grade')))
  }

  //--- UPDATE GRADES ---//
  updateGrade(
    studentnumber: any,
    schedcode: any,
    subjectcode: any,
    gradeData: any
  ): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/grades/update/${studentnumber}/${schedcode}/${subjectcode}`, gradeData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Update Grade')))
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
