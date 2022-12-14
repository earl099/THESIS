import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GradesService } from 'src/app/services/grades.service';
import { StudentService } from 'src/app/services/student.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { VariableService } from 'src/app/services/variable.service';
@Component({
  selector: 'app-cog-reprint',
  templateUrl: './cog-reprint.component.html',
  styleUrls: ['./cog-reprint.component.scss']
})
export class CogReprintComponent implements OnInit {
  globalVar: any
  searchForm: any
  searchVisibility: boolean = true

  currentDate = Date.now()

  resultStudInfo: any
  resultColumns: string[] = [
    'subjectcode',
    'subjectTitle',
    'mygrade',
    'makeupgrade',
    'units',
    'creditUnits'
  ]
  resultGradesList: any
  resultDataSource!: MatTableDataSource<any>
  resultVisibility: boolean = false

  totalUnits: number = 0
  totalCreditUnits: number = 0
  passingPercentage: number = 0
  aveGrade: number = 0
  scholarshipList: string[] = [
    'FULL ACADEMIC',
    'PARTIAL ACADEMIC',
    'NONE'
  ]
  scholarship: string = ''
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private gradesService: GradesService,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.resultStudInfo = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false })
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVar = res.legend
        this.searchForm.get('semester').setValue(this.globalVar[0].ksemester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].kschoolyear)
      }

    })
  }

  generateCog() {
    this.searchVisibility = false
    this.resultVisibility = true


    this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.resultStudInfo.get('studentnumber').setValue(res.student.studentNumber)
        this.resultStudInfo.get('firstname').setValue(res.student.firstName)
        this.resultStudInfo.get('middlename').setValue(res.student.middleName.charAt(0))
        this.resultStudInfo.get('lastname').setValue(res.student.lastName)
        this.resultStudInfo.get('course').setValue(res.student.course)
      }
    })

    this.gradesService.getGradeByStudNumSemSY(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
    ).subscribe((res) => {
      if(res) {
        let creditunitsControl = { creditUnits: '0' }
        this.resultGradesList = res.grades

        for(let i = 0; i < this.resultGradesList.length; i++) {
          let gradeCounter = this.resultGradesList.length
          this.resultGradesList[i] = Object.assign(this.resultGradesList[i], creditunitsControl)
          this.enrollmentService.getSubjectTitle(this.resultGradesList[i].subjectcode).subscribe((res) => {
            let tmpData: any
            if(res) {
              tmpData = res.subject
              this.resultGradesList[i] = Object.assign(this.resultGradesList[i], tmpData)
              //credit units
              if(
                this.resultGradesList[i].mygrade == 'INC' ||
                this.resultGradesList[i].mygrade == 'S'
              ) {
                if(this.resultGradesList[i].makeupgrade == '-') {
                  this.resultGradesList[i].creditUnits = '0'
                }
                else {
                  this.resultGradesList[i].creditUnits = this.resultGradesList[i].units
                }


              }
              else {
                this.resultGradesList[i].creditUnits = this.resultGradesList[i].units
              }


              //grade
              if(!Number.isNaN(Number(this.resultGradesList[i].mygrade))) {
                this.aveGrade += Number(this.resultGradesList[i].mygrade)
              }
              this.totalUnits += Number(this.resultGradesList[i].units)
              this.totalCreditUnits += Number(this.resultGradesList[i].creditUnits)
              this.passingPercentage = (this.totalCreditUnits / this.totalUnits) * 100


              if(i == this.resultGradesList.length - 1) {
                this.resultDataSource = new MatTableDataSource(this.resultGradesList)

                if(this.aveGrade >= 1 && this.aveGrade <= 1.45) {
                  for(let j = 0; j < this.resultGradesList.length; j++){
                    if(
                      this.resultGradesList[j].mygrade == 'INC' ||
                      this.resultGradesList[j].mygrade == 'US' ||
                      this.resultGradesList[j].mygrade == '4.00' ||
                      this.resultGradesList[j].mygrade == '5.00'
                    ) {
                      this.scholarship = this.scholarshipList[2]
                      break
                    }
                    else {
                      this.scholarship = this.scholarshipList[0]
                    }
                  }

                }
                else if(this.aveGrade >= 1.46 && this.aveGrade <= 1.75) {
                  for(let j = 0; j < this.resultGradesList.length; j++){
                    if(
                      this.resultGradesList[j].mygrade == 'INC' ||
                      this.resultGradesList[j].mygrade == 'US' ||
                      this.resultGradesList[j].mygrade == '4.00' ||
                      this.resultGradesList[j].mygrade == '5.00'
                    ) {
                      this.scholarship = this.scholarshipList[2]
                      break
                    }
                    else {
                      this.scholarship = this.scholarshipList[1]
                    }
                  }
                }
                else {
                  this.scholarship = this.scholarshipList[2]
                }
                for(let k = 0; k < this.resultGradesList.length; k++) {
                  if(Number.isNaN(this.resultGradesList[k].mygrade)) {
                    gradeCounter -= 1
                  }
                }
                this.aveGrade /= gradeCounter
                console.log(this.aveGrade)
              }
            }

          })

        }
      }
    })
  }

  exportCog() {
    let data: any = document.getElementById('print')
    html2canvas(data).then((canvas) => {
      let fileWidth = 208
      let fileHeight = (canvas.height * fileWidth) / canvas.width
      const fileURI = canvas.toDataURL('image/jpg')
      let pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0
      let date = new Date(Date.now())
      pdf.addImage(fileURI, 'JPG', 0, position, fileWidth, fileHeight)
      pdf.save(
        this.resultStudInfo.get('lastname').value +
        '-cog-' + (date.getMonth() + 1) + '-' +
        date.getDate() + '-' + date.getFullYear() + '.pdf'
      )
    })
  }

  backToSearch() {
    this.searchVisibility = true
    this.resultVisibility = false

    this.searchForm.get('studentnumber').setValue('')
    this.searchForm.get('semester').setValue('')
    this.searchForm.get('schoolyear').setValue('')
    this.totalUnits = 0
    this.totalCreditUnits = 0
    this.aveGrade = 0
    this.passingPercentage = 0
  }

  numberFilter(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
