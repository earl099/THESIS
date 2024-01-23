import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CurriculumService {
  baseUrl = environment.apiBaseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  //***--- CURRICULUM FUNCTIONS ---***//
  //--- ADD CURRICULUM ---//
  addCurriculum(curriculumData: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/curriculum/add`, curriculumData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Curriculum')));
  }

  //--- GET ALL CURRICULA ---//
  getCurricula(): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/curriculum/list`)
    .pipe(catchError(this.handleError<any>('Get Curricula')));
  }

  //--- GET CURRICULUM ---//
  getCurriculum(id: number): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/curriculum/profile/${id}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Curriculum')));
  }

  //--- EDIT CURRICULUM ---//
  editCurriculum(id: number, curriculumData: any): Observable<any> {
    return this.httpClient
    .put(`${this.baseUrl}/curriculum/edit/${id}`, curriculumData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit Curriculum')))
  }

  //***--- CURRICULUM CONTENT FUNCTIONS ---***//
  //--- ADD CURRICULUM CONTENT ---//
  addCContent(cContentData: any): Observable<any> {
    return this.httpClient
    .post(`${this.baseUrl}/curriculum/content/add`, cContentData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Add Curriculum Content')))
  }

  //--- EDIT CURRICULUM CONTENT ---//
  editCContent(refid: number, id: number, cContentData: any): Observable<any> {
    return this.httpClient
    .put(`${this.baseUrl}/curriculum/content/edit/${refid}/${id}`, cContentData, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Edit Curriculum Content')))
  }

  //--- GET CURRICULUM CONTENT BY COURSE, YEAR AND SEM ---//
  getCContentList(refid: number, yearlevel: number, semester: string): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/curriculum/content/list/${refid}/${yearlevel}/${semester}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Curriculum Content List')))
  }

  //--- CURRICULUM CONTENT PAGE ---//
  getCContent(id: number): Observable<any> {
    return this.httpClient
    .get(`${this.baseUrl}/curriculum/content/page/${id}`, this.httpOptions)
    .pipe(catchError(this.handleError<any>('Get Curriculum Content Page')))
  }


  //--- ERROR HANDLING ---//
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      //this.toastr.error(`${operation} failed !`);
      return of(result as T);
    }
  }
}
