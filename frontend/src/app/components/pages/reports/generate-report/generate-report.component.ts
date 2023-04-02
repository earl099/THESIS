import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ReportService } from 'src/app/services/report.service';
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
  isAdvClicked!: boolean

  //college list and course list
  collegeList: Array<any> = []
  courseList: Array<any> = []
  schoolyearList: Array<any> = []

  constructor(
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private reportService: ReportService,
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

    this.isAdvClicked = false

    this.getColleges()
    console.log(this.reportForm.get('reportType').value)
  }

  generateReport() {
    //if no report type specified
    if(this.reportForm.get('reportType').value == '') {
      this.toastr.error('Please put a Report Type')
    }

    //if advanced is clicked
    if(this.isAdvClicked) {
      if(this.reportForm.get('reportType').value == '') {
        this.toastr.error('Please put a Report Type')
      }
      //if fields are not filled
      else if(
        this.reportForm.get('collegeCode').value == '' ||
        this.reportForm.get('courseCode').value == '' ||
        this.reportForm.get('gender').value == '' ||
        this.reportForm.get('semester').value == '' ||
        this.reportForm.get('schoolyear').value == ''
      ) {
        this.toastr.error('Please fill out all fields.')
      }
    }
  }

  onAdvClick() {
    if(!this.isAdvClicked) {
      this.isAdvClicked = true
    }
    else {
      this.isAdvClicked = false
    }
  }

  getSchoolyear(type: string) {
    this.reportService.getSchoolYearbyReportType(type).subscribe((res) => {
      if(res) {
        let tmpData = res.schoolyear
        console.log(tmpData)
        if(tmpData.length > 0){
          this.schoolyearList.splice(0, this.schoolyearList.length)
        }
        for (let i = 0; i < tmpData.length; i++) {
          this.schoolyearList.push(tmpData[i])
        }
      }
    })
  }

  getColleges() {
    this.reportService.getColleges().subscribe((res) => {
      if(res) {
        let tmpData = res.college
        for (let i = 0; i < tmpData.length; i++) {
          this.collegeList.push(tmpData[i])
          if (i == tmpData.length - 1) {
            this.collegeList.push({collegeCode: 'ALL'})
          }
        }
        //console.log(this.collegeList)
      }
    })
  }

  getCourses(college: string) {
    this.reportService.getCourses(college).subscribe((res) => {
      if(res) {
        let tmpData = res.course
        if(this.courseList.length > 0) {
          this.courseList.splice(0, this.courseList.length)
        }

        for (let i = 0; i < tmpData.length; i++) {
          this.courseList.push(tmpData[i])
        }
        //console.log(this.courseList)
      }
    })
  }
}
