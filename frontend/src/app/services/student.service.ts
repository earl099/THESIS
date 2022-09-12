import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Student } from '../shared/models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }


}
