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
  //QUICK DATA FOR STUDENTS ENROLLED, SHIFTEES, LOA, MALE/FEMALE STUDENTS ENROLLED, VALIDATED/ASSESSED RATIO, ASSESSED,
  //ENROLLED WITH SCHOLARSHIP, WITHOUT SCHOLARSHIP, REGULAR AND IRREGULAR
  quickData: Array<number> = [0,0,0,0,0,0,0,0,0,0,0]
  studentList: any

  constructor(
    private router: Router,
    private userService: UserService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.globalVar = ['']

    this.userService.getUser(this.userService.getToken()).subscribe((res) => {
      if(res) {
        this.uname = res.user.username
      }
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        let globalTmpData = res.legend
        this.globalVar = globalTmpData
        let tmpData: any

        this.enrollmentService.getStudsEnroll(this.globalVar[0].semester, this.globalVar[0].schoolyear)?.subscribe((res) => {
          if(res) {
            tmpData = res.studsEnroll
            console.log(tmpData)

            if(tmpData.length < 1) {
              this.quickData[0] = 0
            }
            else {
              this.quickData[0] += tmpData.length
            }

            for (let i = 0; i < tmpData.length; i++) {
              if(tmpData[i].scholarship == 'NO DISCOUNT') {
                this.quickData[7]++
              }
              else {
                this.quickData[8]++
              }

              if(tmpData[i].status == 'REGULAR') {
                this.quickData[9]++
              }
              else {
                this.quickData[10]++
              }

              this.studentService.getStudent(tmpData[i].studentnumber)?.subscribe((res) => {
                if(res) {
                  if(res.student.gender == 'MALE') {
                    this.quickData[3]++
                  }
                  else {
                    this.quickData[4]++
                  }
                }
              })
            }
          }
        })

        this.enrollmentService.getAllAssessed(this.globalVar[0].semester, this.globalVar[0].schoolyear).subscribe((res) => {
          if(res) {
            let totalAssessed = res.assessedStuds
            //console.log(totalAssessed)
            this.quickData[6] = totalAssessed.length

            for (let i = 0; i < totalAssessed.length; i++) {
              //console.log(totalAssessed[i])

              try {
                for (let j = 0; j < tmpData.length; j++) {
                  if(tmpData[j].studentnumber == totalAssessed[i].studentnumber) {
                    this.quickData[5]++
                  }
                }
              } catch (error) {

              }

            }

            this.quickData[5] = (this.quickData[5] / totalAssessed.length) * 100

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
