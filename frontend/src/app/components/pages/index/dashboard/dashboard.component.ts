import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  globalVar!: Array<any>
  uname: any
  quickData: Array<number> = [0,0,0]


  constructor(
    private router: Router,
    private userService: UserService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private variableService: VariableService
  ) {

  }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.globalVar = ['']

    this.uname = localStorage?.getItem('user')
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        let globalTmpData = res.legend
        this.globalVar = globalTmpData
        this.enrollmentService.getStudsEnroll(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            let tmpData = res.studsEnroll
            if(tmpData.length < 1) {
              this.quickData[0] = 0
            }
            else {
              this.quickData[0] += tmpData.length
            }
          }
        })

        this.studentService.getShifteesBySemAndSY(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            let tmpData = res.shiftees
            //console.log(tmpData)

            if(tmpData.length < 1) {
              this.quickData[1] = 0
            }
            else {
              this.quickData[1] += tmpData.length
            }
          }
        })

        this.studentService.getLoaBySemesterAndSY(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            let tmpData = res.loa
            console.log(tmpData)
            
            if(tmpData.length < 1) {
              this.quickData[2] = 0
            }
            else {
              this.quickData[2] += tmpData.length
            }
          }
        })
      }
    })


  }
}
