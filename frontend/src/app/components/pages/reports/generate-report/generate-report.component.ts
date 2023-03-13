import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {
  globalVar: any
  reportForm: any


  constructor(
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.globalVar = this.variableService.getLegend().subscribe()

    this.reportForm = this.fb.group({
      reportType: new FormControl({ value: '', disabled: false }),
      collegeCode: new FormControl({ value: localStorage.getItem('token'), disabled: false }),
      courseCode: new FormControl({ value: '', disabled: false }),

      //advanced filters for Students Enrolled, w/ LOA and shiftees
      gender: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })
  }

  
}
