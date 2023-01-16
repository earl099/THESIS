import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-dropping',
  templateUrl: './dropping.component.html',
  styleUrls: ['./dropping.component.scss']
})
export class DroppingComponent implements OnInit {
  //VARIABLE FOR DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
  globalVar: any

  //VARIABLES FOR SEARCH AND ITS VISIBILITY
  searchForm: any
  searchVisibility: boolean = true

  //VARIABLES FOR RESULTS AND ITS VISIBILITY
  resultDataSource!: MatTableDataSource<any>
  resultVisibility: boolean = false

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {

  }

}
