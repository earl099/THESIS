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

  //--- ADD STUDENT ENROLLED ---//
  addStudEnroll(data: any) {
    return this.httpClient
    .post(`${this.baseUrl}/student_enroll/add`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Student Enrolled')))
  }

  //--- EDIT STUDENT ENROLLED ---//
  editStudEnroll(
    studentnumber: any,
    semester: any,
    schoolyear: any,
    data: any
    ): Observable<any> {
      return this.httpClient
      .put(`${this.baseUrl}/student_enroll/${studentnumber}/${semester}/${schoolyear}`, data, this.httpOptions)
      .pipe(catchError(this.handleError<any>('Edit Student Enrolled')))
    }

  //--- GET STUDENTS ENROLLED ---//
  getStudsEnroll(semester: any, schoolyear: any): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/student_enroll/list/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Students Enrolled')))
  }


  //--- GET STUDENT ENROLLED ---//
  getStudEnroll(
    studentNumber: any,
    semester: any,
    schoolyear: any
  ): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/student_enroll/${studentNumber}/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Student Enrolled')))
  }

  //--- ADD SUBJECT ENROLLED ---//
  addSubjEnrolled(data: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/validation/add`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Subject Enrolled')))
  }

  //--- GET SUBJECTS ENROLLED ---//
  getSubjsEnrolled(studentnumber: any, semester: any, schoolyear: any): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/validation/get/${studentnumber}/${semester}/${schoolyear}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Subject Enrolled')))
  }

  //--- DELETE SUBJECT ENROLLED ---//
  deleteSubjEnrolled(studentnumber: any, schedcode: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/validation/drop/${studentnumber}/${schedcode}`)
    .pipe(catchError(this.handleError<any>('Delete Subject Enrolled')))
  }

  //--- ADD SUBJECT ---//
  addSubject(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/subject/add`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Subject')))
  }

  //--- EDIT SUBJECT ---//
  editSubject(subjectcode: any, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/subject/edit/${subjectcode}`, data, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit Subject')))
  }

  //--- GET SUBJECT ---//
  getSubject(subjectcode: any) {
    return this.httpClient.get(`${this.baseUrl}/subject/get/${subjectcode}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Subject')))
  }

  //--- GET SUBJECT TITLE ---//
  getSubjectTitle(subjectcode: any) {
    return this.httpClient.get(`${this.baseUrl}/subject/get/title/${subjectcode}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Subject Title')))
  }

  getSubjects() {
    return this.httpClient.get(`${this.baseUrl}/subject/all`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Subjects')))
  }

  //--- DELETE SUBJECT ---//
  deleteSubject(subjectcode: any) {
    return this.httpClient.delete(`${this.baseUrl}/subject/delete/${subjectcode}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Delete Subject')))
  }

  //--- GET SCHOLARSHIPS ---//
  getScholarships(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/scholarship/list`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Scholarships')))
  }

  //--- GET SCHOLARSHIP DETAILS ---//
  getScholarshipDetails(scholarship: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/scholarship/${scholarship}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Scholarship Details')))
  }

  //--- TRANSACTION FOR STUDENT VALIDATION ---//
  addValidateStudent(studentnumber: any, semester: any, schoolyear: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/validate/${studentnumber}/${semester}/${schoolyear}`,
      this.httpOptions
    ).pipe(catchError(this.handleError<any>('Validate Student')))
  }

  //--- TRANSACTION FOR ADDING SUBJECT ---//
  addSubjTransaction(studentnumber: any, semester: any, schoolyear: any, data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/validate/add/${studentnumber}/${semester}/${schoolyear}`,
      data, this.httpOptions
    ).pipe(catchError(this.handleError<any>('Add Subject')))
  }

  //--- TRANSACTION FOR DELETING SUBJECT ---//
  dropSubjTransaction(studentnumber: any, semester: any, schoolyear: any, data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/validate/drop/${studentnumber}/${semester}/${schoolyear}`,
      data, this.httpOptions
    ).pipe(catchError(this.handleError<any>('Drop Subject')))
  }

  //--- GET ALL ASSESSED STUDENTS BY SEEMESTER AND SCHOOLYEAR ---//
  getAllAssessed(semester: any, schoolyear: any): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/assess_list/${semester}/${schoolyear}`, this.httpOptions
    ).pipe(catchError(this.handleError<any>('Get Assessed Students')))
  }

  //--- GET ASSESSED STUDENT ---//
  getAssessedStudent(studentnumber: any, semester: any, schoolyear: any): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/assess_list/current/${studentnumber}/${semester}/${schoolyear}`, this.httpOptions
    ).pipe(catchError(this.handleError<any>('Get Assessed Student')))
  }

  //--- EDIT SCHOLARSHIP ---//
  editScholarship(studentnumber: any, semester: any, schoolyear: any, data: any): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}/assess_list/edit/scholarship/${studentnumber}/${semester}/${schoolyear}`,
      data, this.httpOptions
    ).pipe(catchError(this.handleError<any>('Edit Scholarship')))
  }

  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      //this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
