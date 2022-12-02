import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-regform-reprint',
  templateUrl: './regform-reprint.component.html',
  styleUrls: ['./regform-reprint.component.scss']
})
export class RegformReprintComponent implements OnInit {
  searchForm: any
  searchVisibility: boolean = true

  //--- STUDENT INFO AND DIVISION OF FEES DATA ---//
  resultForm: any
  currentDate = Date.now()

  //--- SUBJECTS TABLE DATA ---//
  resultSubjectsList: any
  totalUnits: number = 0
  totalHours: number = 0
  totalAmount: number = 0
  resultSubjectsColumn: string[] = [
    'schedcode',
    'subjectcode',
    'subjectTitle',
    'units',
    'time',
    'day',
    'room'
  ]
  resultDataSource!: MatTableDataSource<any>
  resultVisibility: boolean = false

  @ViewChild('print') print!: ElementRef

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.resultForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false }),
      major:  new FormControl({ value: '', disabled: false }),
      year:  new FormControl({ value: '', disabled: false }),
      address:  new FormControl({ value: '', disabled: false }),
      section:  new FormControl({ value: '', disabled: false }),
      scholarship: new FormControl({ value: '', disabled: false }),
      discountSrf: new FormControl({ value: '', disabled: false }),
      discountSfdf: new FormControl({ value: '', disabled: false }),
      discountTuition: new FormControl({ value: '', disabled: false }),
      ansci: new FormControl({ value: '', disabled: false }),
      biosci: new FormControl({ value: '', disabled: false }),
      cemds: new FormControl({ value: '', disabled: false }),
      hrm: new FormControl({ value: '', disabled: false }),
      cropsci: new FormControl({ value: '', disabled: false }),
      engineering: new FormControl({ value: '', disabled: false }),
      physci: new FormControl({ value: '', disabled: false }),
      vetmed: new FormControl({ value: '', disabled: false }),
      speech: new FormControl({ value: '', disabled: false }),
      english: new FormControl({ value: '', disabled: false }),
      nursing: new FormControl({ value: '', disabled: false }),
      ccl: new FormControl({ value: '', disabled: false }),
      rle: new FormControl({ value: '', disabled: false }),
      internet: new FormControl({ value: '', disabled: false }),
      nstp: new FormControl({ value: '', disabled: false }),
      ojt: new FormControl({ value: '', disabled: false }),
      thesis: new FormControl({ value: '', disabled: false }),
      student: new FormControl({ value: '', disabled: false }),
      late: new FormControl({ value: '', disabled: false }),
      residency: new FormControl({ value: '', disabled: false }),
      foreignstudent: new FormControl({ value: '', disabled: false }),
      addedsubj: new FormControl({ value: '', disabled: false }),
      petition: new FormControl({ value: '', disabled: false }),
      tuition: new FormControl({ value: '', disabled: false }),
      library: new FormControl({ value: '', disabled: false }),
      medical: new FormControl({ value: '', disabled: false }),
      publication: new FormControl({ value: '', disabled: false }),
      registration: new FormControl({ value: '', disabled: false }),
      guidance: new FormControl({ value: '', disabled: false }),
      id: new FormControl({ value: '', disabled: false }),
      sfdf: new FormControl({ value: '', disabled: false }),
      srf: new FormControl({ value: '', disabled: false }),
      athletic: new FormControl({ value: '', disabled: false }),
      scuaa: new FormControl({ value: '', disabled: false }),
      deposit: new FormControl({ value: '', disabled: false }),
      cspear: new FormControl({ value: '', disabled: false }),
      edfs: new FormControl({ value: '', disabled: false }),
      psyc: new FormControl({ value: '', disabled: false }),
      trm: new FormControl({ value: '', disabled: false }),
      fishery: new FormControl({ value: '', disabled: false }),
      totalLab: new FormControl({ value: '', disabled: false }),
      totalOther: new FormControl({ value: '', disabled: false })
    })
  }

  generateRegForm() {
    this.searchVisibility = false
    this.resultVisibility = true
    this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.resultForm.get('studentnumber').setValue(res.student.studentNumber)
        this.resultForm.get('firstname').setValue(res.student.firstName)
        this.resultForm.get('middlename').setValue(res.student.middleName.charAt(0))
        this.resultForm.get('lastname').setValue(res.student.lastName)
        this.resultForm.get('address').setValue(res.student.street + ', ' + res.student.municipality + ', ' + res.student.province)
      }
    })

    this.enrollmentService.getStudEnroll(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
    ).subscribe((res) => {
      this.resultForm.get('course').setValue(res.studEnroll.coursenow)
      this.resultForm.get('major').setValue(res.studEnroll.majorCourse)
      this.resultForm.get('year').setValue(res.studEnroll.yearLevel)
      this.resultForm.get('scholarship').setValue(res.studEnroll.scholarship)

      this.enrollmentService.getScholarshipDetails(this.resultForm.get('scholarship').value).subscribe((res) => {
        this.resultForm.get('discountSrf').setValue(res.scholarshipDetails.srf)
        this.resultForm.get('discountSfdf').setValue(res.scholarshipDetails.sfdf)
        this.resultForm.get('discountTuition').setValue(res.scholarshipDetails.tuition)
        console.log(this.resultForm.value)
      })
    })



    this.enrollmentService.getDivOfFees(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
      ).subscribe((res) => {
        if(res) {
          this.resultForm.get('ansci').setValue(Number.parseFloat(res.divOfFees.ansci))
          this.resultForm.get('biosci').setValue(Number.parseFloat(res.divOfFees.biosci))
          this.resultForm.get('cemds').setValue(Number.parseFloat(res.divOfFees.cemds))
          this.resultForm.get('hrm').setValue(Number.parseFloat(res.divOfFees.hrm))
          this.resultForm.get('cropsci').setValue(Number.parseFloat(res.divOfFees.cropsci))
          this.resultForm.get('engineering').setValue(Number.parseFloat(res.divOfFees.engineering))
          this.resultForm.get('physci').setValue(Number.parseFloat(res.divOfFees.physci))
          this.resultForm.get('vetmed').setValue(Number.parseFloat(res.divOfFees.vetmed))
          this.resultForm.get('speech').setValue(Number.parseFloat(res.divOfFees.speech))
          this.resultForm.get('english').setValue(Number.parseFloat(res.divOfFees.english))
          this.resultForm.get('nursing').setValue(Number.parseFloat(res.divOfFees.nursing))
          this.resultForm.get('ccl').setValue(Number.parseFloat(res.divOfFees.ccl))
          this.resultForm.get('rle').setValue(Number.parseFloat(res.divOfFees.rle))
          this.resultForm.get('internet').setValue(Number.parseFloat(res.divOfFees.internet))
          this.resultForm.get('nstp').setValue(Number.parseFloat(res.divOfFees.nstp))
          this.resultForm.get('ojt').setValue(Number.parseFloat(res.divOfFees.ojt))
          this.resultForm.get('thesis').setValue(Number.parseFloat(res.divOfFees.thesis))
          this.resultForm.get('student').setValue(Number.parseFloat(res.divOfFees.student))
          this.resultForm.get('late').setValue(Number.parseFloat(res.divOfFees.late))
          this.resultForm.get('residency').setValue(Number.parseFloat(res.divOfFees.residency))
          this.resultForm.get('foreignstudent').setValue(Number.parseFloat(res.divOfFees.foreignstudent))
          this.resultForm.get('addedsubj').setValue(Number.parseFloat(res.divOfFees.addedsubj))
          this.resultForm.get('petition').setValue(Number.parseFloat(res.divOfFees.petition))
          this.resultForm.get('tuition').setValue(Number.parseFloat(res.divOfFees.tuition))
          this.resultForm.get('library').setValue(Number.parseFloat(res.divOfFees.library))
          this.resultForm.get('medical').setValue(Number.parseFloat(res.divOfFees.medical))
          this.resultForm.get('publication').setValue(Number.parseFloat(res.divOfFees.publication))
          this.resultForm.get('registration').setValue(Number.parseFloat(res.divOfFees.registration))
          this.resultForm.get('guidance').setValue(Number.parseFloat(res.divOfFees.guidance))
          this.resultForm.get('id').setValue(Number.parseFloat(res.divOfFees.id))
          this.resultForm.get('sfdf').setValue(Number.parseFloat(res.divOfFees.sfdf))
          this.resultForm.get('srf').setValue(Number.parseFloat(res.divOfFees.srf))
          this.resultForm.get('athletic').setValue(Number.parseFloat(res.divOfFees.athletic))
          this.resultForm.get('scuaa').setValue(Number.parseFloat(res.divOfFees.scuaa))
          this.resultForm.get('deposit').setValue(Number.parseFloat(res.divOfFees.deposit))
          this.resultForm.get('cspear').setValue(Number.parseFloat(res.divOfFees.cspear))
          this.resultForm.get('edfs').setValue(Number.parseFloat(res.divOfFees.edfs))
          this.resultForm.get('psyc').setValue(Number.parseFloat(res.divOfFees.psyc))
          this.resultForm.get('trm').setValue(Number.parseFloat(res.divOfFees.trm))
          this.resultForm.get('fishery').setValue(Number.parseFloat(res.divOfFees.fishery))
          this.resultForm.get('totalLab').setValue(
            this.resultForm.get('ansci').value +
            this.resultForm.get('biosci').value +
            this.resultForm.get('cemds').value +
            this.resultForm.get('hrm').value +
            this.resultForm.get('cropsci').value +
            this.resultForm.get('engineering').value +
            this.resultForm.get('physci').value +
            this.resultForm.get('vetmed').value +
            this.resultForm.get('speech').value +
            this.resultForm.get('english').value +
            this.resultForm.get('ccl').value +
            this.resultForm.get('cspear').value +
            this.resultForm.get('fishery').value +
            this.resultForm.get('psyc').value
          )
          this.resultForm.get('totalOther').setValue(
            this.resultForm.get('internet').value +
            this.resultForm.get('nstp').value +
            this.resultForm.get('ojt').value +
            this.resultForm.get('thesis').value +
            this.resultForm.get('rle').value +
            this.resultForm.get('student').value +
            this.resultForm.get('late').value +
            this.resultForm.get('residency').value +
            this.resultForm.get('foreignstudent').value +
            this.resultForm.get('addedsubj').value +
            this.resultForm.get('petition').value
          )

          this.totalAmount += (
            this.resultForm.get('tuition').value +
            this.resultForm.get('library').value +
            this.resultForm.get('medical').value +
            this.resultForm.get('publication').value +
            this.resultForm.get('registration').value +
            this.resultForm.get('guidance').value +
            this.resultForm.get('id').value +
            this.resultForm.get('sfdf').value +
            this.resultForm.get('srf').value +
            this.resultForm.get('athletic').value +
            this.resultForm.get('scuaa').value +
            this.resultForm.get('deposit').value +
            this.resultForm.get('edfs').value +
            this.resultForm.get('trm').value +
            this.resultForm.get('totalLab').value +
            this.resultForm.get('totalOther').value
          )
        }
      }
    )

    this.enrollmentService.getSubjsEnrolled(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
    )
    .subscribe((res) => {
      if(res) {
        this.resultSubjectsList = res.subjsEnrolled
        //console.log(this.resultSubjectsList)
        for(let i = 0; i < this.resultSubjectsList.length; i++) {
          this.scheduleService.getSchedule(
            this.resultSubjectsList[i].schedcode
          )
          .subscribe((res) => {
            let tmpResult: any
            if(res) {
              tmpResult = res.schedule
              this.resultSubjectsList[i] = Object.assign(this.resultSubjectsList[i], tmpResult)
              this.totalUnits += (Number(tmpResult.units) + Number(tmpResult.labunits))
              this.totalHours += Number(tmpResult.oras)
              this.enrollmentService.getSubjectTitle(
                this.resultSubjectsList[i].subjectCode
              )
              .subscribe((res) => {
                let tmpResult2: any
                if(res) {
                  tmpResult2 = res.subject
                  this.resultSubjectsList[i] = Object.assign(this.resultSubjectsList[i], tmpResult2)
                  if(i == this.resultSubjectsList.length - 1) {
                    this.resultDataSource = new MatTableDataSource(this.resultSubjectsList)
                    console.log(this.resultSubjectsList)
                    for(let j = 0; j < this.resultSubjectsList.length; j++) {
                      let sectionChecker: boolean = true
                      if(j == 0) {
                        sectionChecker = true
                      }
                      else {
                        if(j != this.resultSubjectsList.length - 1) {
                          if(this.resultSubjectsList[j].section == this.resultSubjectsList[j-1].section) {
                            sectionChecker = true
                          }
                          else {
                            sectionChecker = false
                            this.resultForm.get('section').setValue('IRREGULAR')
                            break
                          }
                        }
                        else {
                          if(sectionChecker == true) {
                            this.resultForm.get('section').setValue(this.resultSubjectsList[j].section)
                          }
                          else {
                            this.resultForm.get('section').setValue('IRREGULAR')
                          }
                        }
                      }
                    }
                  }
                }
              })
            }
          })
        }
      }
    })
  }

  exportRegForm() {
    let data: any = document.getElementById('print')
    html2canvas(data).then((canvas) => {
      let fileWidth = 208
      let fileHeight = (canvas.height * fileWidth) / canvas.width
      const fileURI = canvas.toDataURL('image/jpg')
      let pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0
      let date = new Date(Date.now())
      pdf.addImage(fileURI, 'JPG', 0, position, fileWidth, fileHeight)
      pdf.save( this.resultForm.get('lastname').value + '-regform-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '.pdf')
    })
  }

  backToSearch() {
    this.searchVisibility = true
    this.resultVisibility = false
    this.searchForm.get('studentnumber').setValue('')
    this.searchForm.get('semester').setValue('')
    this.searchForm.get('schoolyear').setValue('')
    this.totalHours = 0
    this.totalUnits = 0
    this.totalAmount = 0
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
