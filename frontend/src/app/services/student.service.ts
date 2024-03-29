import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  //--- SHIFTEE ADDING FUNCTION ---//
  addShiftee(shifteeData: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/shiftee/add`, shifteeData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Shiftee')))
  }

  //--- GET ALL SHIFTEES ---//
  getShiftees(): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/shiftee/list`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Shiftees')))
  }

  getShifteesBySemAndSY(semester: string, schoolyear: string): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/shiftee/list/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Shiftees')))
  }

  //--- ADD STUDENT FUNCTION ---//
  addStudent(studentData: any): Observable<any> {
    return this.httpClient
    .post(
      `${this.baseUrl}/student/add`, studentData, this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Create Student'))
    );
  }

  //--- GET STUDENTS FUNCTION ---//
  getAllStudents(): Observable<any> {
    return this.httpClient
    .get(
      `${this.baseUrl}/student/list`, { params: {page: 1, size: 50} }
    )
    .pipe(
      catchError(this.handleError<any>('Get Students'))
    );
  }

  //--- STUDENT PROFILE FUNCTION ---//
  getStudent(studentNumber: number): Observable<any> {
    return this.httpClient
    .get(
      `${this.baseUrl}/student/profile/${studentNumber}`,
      this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Get Student'))
    );
  }

  //--- STUDENT MODIFICATION FUNCTION ---//
  editStudent(studentNumber: number, studentData: any): Observable<any> {
    return this.httpClient
    .put(
      `${this.baseUrl}/student/edit/${studentNumber}`,
      studentData,
      this.httpOptions
    )
    .pipe(
      catchError(this.handleError<any>('Edit Student'))
    );
  }

  //--- COURSE MODIFICATION FUNCTION ---//
  editCourse(studentNumber: number, studentData: any): Observable<any> {
    return this.httpClient
    .put(`${this.baseUrl}/student/edit/course/${studentNumber}`, studentData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit Course')))
  }

  //--- ADD LOA FUNCTION ---//
  addLoa(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/loa/add`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Loa')))
  }

  //--- ADMIN SEARCH FUNCTION ---//
  adminSearch(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/loa/get/all`, this.httpOptions)
  }

  //--- USER SEARCH FUNCTION ---//
  userSearch(collegeID: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/loa/get/${collegeID}`, this.httpOptions)
  }

  //--- GET LOA BY SEMESTER AND SCHOOLYEAR ---//
  getLoaBySemesterAndSY(semester: string, schoolyear: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/loa/get/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Loa')))
  }

  //--- DELETE FUNCTION ---//
  deleteLoa(studentnumber: any, data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/loa/delete/${studentnumber}`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Delete Loa Record')))
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      //this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
