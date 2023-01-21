import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {
  //VARIABLE FOR DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
  globalVar: any

  //SEARCH FORM FOR PARAMETERS IN VALIDATION FUNCTION
  searchForm: any
  searchVisibility: boolean = true

  //VARIABLES FOR THE VALIDATED STUDENT
  resultForm: any
  totalAmount: number = 0
  ptotalAmount: number = 0
  resultSubjList: any
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

  //WILL BE MAKING A FUNCTION THAT EDITS THE SCHOLARSHIP OF THE STUDENT AND UPDATES THE AFFECTED TABLES


  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    this.resultForm = this.fb.group({
      //student information
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
      course:  new FormControl({ value: '', disabled: false }),
      major:  new FormControl({ value: '', disabled: false }),
      year:  new FormControl({ value: '', disabled: false }),
      scholarship: new FormControl({ value: '', disabled: false }),
      discountSrf: new FormControl({ value: '', disabled: false }),
      discountSfdf: new FormControl({ value: '', disabled: false }),
      discountTuition: new FormControl({ value: '', disabled: false }),

      //division of fees
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
      totalOther: new FormControl({ value: '', disabled: false }),

      //paid divoffees
      pansci: new FormControl({ value: '', disabled: false }),
      pbiosci: new FormControl({ value: '', disabled: false }),
      pcemds: new FormControl({ value: '', disabled: false }),
      phrm: new FormControl({ value: '', disabled: false }),
      pcropsci: new FormControl({ value: '', disabled: false }),
      pengineering: new FormControl({ value: '', disabled: false }),
      pphysci: new FormControl({ value: '', disabled: false }),
      pvetmed: new FormControl({ value: '', disabled: false }),
      pspeech: new FormControl({ value: '', disabled: false }),
      penglish: new FormControl({ value: '', disabled: false }),
      pnursing: new FormControl({ value: '', disabled: false }),
      pccl: new FormControl({ value: '', disabled: false }),
      prle: new FormControl({ value: '', disabled: false }),
      pinternet: new FormControl({ value: '', disabled: false }),
      pnstp: new FormControl({ value: '', disabled: false }),
      pojt: new FormControl({ value: '', disabled: false }),
      pthesis: new FormControl({ value: '', disabled: false }),
      pstudent: new FormControl({ value: '', disabled: false }),
      plate: new FormControl({ value: '', disabled: false }),
      presidency: new FormControl({ value: '', disabled: false }),
      pforeignstudent: new FormControl({ value: '', disabled: false }),
      paddedsubj: new FormControl({ value: '', disabled: false }),
      ppetition: new FormControl({ value: '', disabled: false }),
      ptuition: new FormControl({ value: '', disabled: false }),
      plibrary: new FormControl({ value: '', disabled: false }),
      pmedical: new FormControl({ value: '', disabled: false }),
      ppublication: new FormControl({ value: '', disabled: false }),
      pregistration: new FormControl({ value: '', disabled: false }),
      pguidance: new FormControl({ value: '', disabled: false }),
      pid: new FormControl({ value: '', disabled: false }),
      psfdf: new FormControl({ value: '', disabled: false }),
      psrf: new FormControl({ value: '', disabled: false }),
      pathletic: new FormControl({ value: '', disabled: false }),
      pscuaa: new FormControl({ value: '', disabled: false }),
      pdeposit: new FormControl({ value: '', disabled: false }),
      pcspear: new FormControl({ value: '', disabled: false }),
      pedfs: new FormControl({ value: '', disabled: false }),
      ppsyc: new FormControl({ value: '', disabled: false }),
      ptrm: new FormControl({ value: '', disabled: false }),
      pfishery: new FormControl({ value: '', disabled: false }),
      ptotalLab: new FormControl({ value: '', disabled: false }),
      ptotalOther: new FormControl({ value: '', disabled: false })
    })

    this.variableService.getLegend().subscribe((res) => {
      if(res){
        this.globalVar = res.legend
        this.searchForm.get('semester').setValue(this.globalVar[0].semester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
      }

    })
  }

  generateData() {
    this.searchVisibility = false
    this.resultVisibility = true

    //--- BASIC INFORMATION ---//
    this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
      if(res) {
        this.resultForm.get('studentnumber').setValue(res.student.studentNumber)
        this.resultForm.get('firstname').setValue(res.student.firstName)
        this.resultForm.get('middlename').setValue(res.student.middleName.charAt(0))
        this.resultForm.get('lastname').setValue(res.student.lastName)
      }
    })

    this.enrollmentService.addValidateStudent(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
    ).subscribe((res) => {
      if(res) {
        this.resultForm.get('course').setValue(res.studEnroll.coursenow)
        this.resultForm.get('major').setValue(res.studEnroll.majorCourse)
        this.resultForm.get('year').setValue(res.studEnroll.yearLevel)
        this.resultForm.get('scholarship').setValue(res.scholarship.scholarship)
        this.resultForm.get('discountSrf').setValue(res.scholarship.srf)
        this.resultForm.get('discountSfdf').setValue(res.scholarship.sfdf)
        this.resultForm.get('discountTuition').setValue(res.scholarship.tuition)
        //--- BASIC INFORMATION ENDS HERE ---//

        //--- SUBJECT ENROLLED LIST ---//
        this.resultSubjList = res.schedule
        this.resultDataSource = new MatTableDataSource(this.resultSubjList)

        //--- UNPAID DIVISION OF FEES SECTION ---//
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
          this.resultForm.get('psyc').value +
          this.resultForm.get('trm').value
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
          this.resultForm.get('petition').value +
          this.resultForm.get('tuition').value +
          this.resultForm.get('srf').value +
          this.resultForm.get('sfdf').value +
          this.resultForm.get('deposit').value +
          this.resultForm.get('library').value +
          this.resultForm.get('medical').value +
          this.resultForm.get('publication').value +
          this.resultForm.get('registration').value +
          this.resultForm.get('guidance').value +
          this.resultForm.get('id').value +
          this.resultForm.get('athletic').value +
          this.resultForm.get('scuaa').value
        )

        this.totalAmount += this.resultForm.get('totalLab').value + this.resultForm.get('totalOther').value
        //--- UNPAID DIVISION OF FEES END HERE ---//

        //--- PAID DIVISION OF FEES ---//
        if(res.scholarship.scholarship != 'RA 10931') {
          this.resultForm.get('pansci').setValue(Number.parseFloat(res.divOfFees.pansci))
          this.resultForm.get('pbiosci').setValue(Number.parseFloat(res.divOfFees.pbiosci))
          this.resultForm.get('pcemds').setValue(Number.parseFloat(res.divOfFees.pcemds))
          this.resultForm.get('phrm').setValue(Number.parseFloat(res.divOfFees.phrm))
          this.resultForm.get('pcropsci').setValue(Number.parseFloat(res.divOfFees.pcropsci))
          this.resultForm.get('pengineering').setValue(Number.parseFloat(res.divOfFees.pengineering))
          this.resultForm.get('pphysci').setValue(Number.parseFloat(res.divOfFees.pphysci))
          this.resultForm.get('pvetmed').setValue(Number.parseFloat(res.divOfFees.pvetmed))
          this.resultForm.get('pspeech').setValue(Number.parseFloat(res.divOfFees.pspeech))
          this.resultForm.get('penglish').setValue(Number.parseFloat(res.divOfFees.penglish))
          this.resultForm.get('pnursing').setValue(Number.parseFloat(res.divOfFees.pnursing))
          this.resultForm.get('pccl').setValue(Number.parseFloat(res.divOfFees.pccl))
          this.resultForm.get('prle').setValue(Number.parseFloat(res.divOfFees.prle))
          this.resultForm.get('pinternet').setValue(Number.parseFloat(res.divOfFees.pinternet))
          this.resultForm.get('pnstp').setValue(Number.parseFloat(res.divOfFees.pnstp))
          this.resultForm.get('pojt').setValue(Number.parseFloat(res.divOfFees.pojt))
          this.resultForm.get('pthesis').setValue(Number.parseFloat(res.divOfFees.pthesis))
          this.resultForm.get('pstudent').setValue(Number.parseFloat(res.divOfFees.pstudent))
          this.resultForm.get('plate').setValue(Number.parseFloat(res.divOfFees.plate))
          this.resultForm.get('presidency').setValue(Number.parseFloat(res.divOfFees.presidency))
          this.resultForm.get('pforeignstudent').setValue(Number.parseFloat(res.divOfFees.pforeignstudent))
          this.resultForm.get('paddedsubj').setValue(Number.parseFloat(res.divOfFees.paddedsubj))
          this.resultForm.get('ppetition').setValue(Number.parseFloat(res.divOfFees.ppetition))
          this.resultForm.get('ptuition').setValue(Number.parseFloat(res.divOfFees.ptuition))
          this.resultForm.get('plibrary').setValue(Number.parseFloat(res.divOfFees.plibrary))
          this.resultForm.get('pmedical').setValue(Number.parseFloat(res.divOfFees.pmedical))
          this.resultForm.get('ppublication').setValue(Number.parseFloat(res.divOfFees.ppublication))
          this.resultForm.get('pregistration').setValue(Number.parseFloat(res.divOfFees.pregistration))
          this.resultForm.get('pguidance').setValue(Number.parseFloat(res.divOfFees.pguidance))
          this.resultForm.get('pid').setValue(Number.parseFloat(res.divOfFees.pid))
          this.resultForm.get('psfdf').setValue(Number.parseFloat(res.divOfFees.psfdf))
          this.resultForm.get('psrf').setValue(Number.parseFloat(res.divOfFees.psrf))
          this.resultForm.get('pathletic').setValue(Number.parseFloat(res.divOfFees.pathletic))
          this.resultForm.get('pscuaa').setValue(Number.parseFloat(res.divOfFees.pscuaa))
          this.resultForm.get('pdeposit').setValue(Number.parseFloat(res.divOfFees.pdeposit))
          this.resultForm.get('pcspear').setValue(Number.parseFloat(res.divOfFees.pcspear))
          this.resultForm.get('pedfs').setValue(Number.parseFloat(res.divOfFees.pedfs))
          this.resultForm.get('ppsyc').setValue(Number.parseFloat(res.divOfFees.ppsyc))
          this.resultForm.get('ptrm').setValue(Number.parseFloat(res.divOfFees.ptrm))
          this.resultForm.get('pfishery').setValue(Number.parseFloat(res.divOfFees.pfishery))
          this.resultForm.get('ptotalLab').setValue(
            this.resultForm.get('pansci').value +
            this.resultForm.get('pbiosci').value +
            this.resultForm.get('pcemds').value +
            this.resultForm.get('phrm').value +
            this.resultForm.get('pcropsci').value +
            this.resultForm.get('pengineering').value +
            this.resultForm.get('pphysci').value +
            this.resultForm.get('pvetmed').value +
            this.resultForm.get('pspeech').value +
            this.resultForm.get('penglish').value +
            this.resultForm.get('pccl').value +
            this.resultForm.get('pcspear').value +
            this.resultForm.get('pfishery').value +
            this.resultForm.get('ppsyc').value +
            this.resultForm.get('ptrm').value
          )
          this.resultForm.get('ptotalOther').setValue(
            this.resultForm.get('pinternet').value +
            this.resultForm.get('pnstp').value +
            this.resultForm.get('pojt').value +
            this.resultForm.get('pthesis').value +
            this.resultForm.get('prle').value +
            this.resultForm.get('pstudent').value +
            this.resultForm.get('plate').value +
            this.resultForm.get('presidency').value +
            this.resultForm.get('pforeignstudent').value +
            this.resultForm.get('paddedsubj').value +
            this.resultForm.get('ppetition').value +
            this.resultForm.get('ptuition').value +
            this.resultForm.get('psrf').value +
            this.resultForm.get('psfdf').value +
            this.resultForm.get('pdeposit').value +
            this.resultForm.get('plibrary').value +
            this.resultForm.get('pmedical').value +
            this.resultForm.get('ppublication').value +
            this.resultForm.get('pregistration').value +
            this.resultForm.get('pguidance').value +
            this.resultForm.get('pid').value +
            this.resultForm.get('pathletic').value +
            this.resultForm.get('pscuaa').value
          )

          this.ptotalAmount += this.resultForm.get('ptotalLab').value + this.resultForm.get('ptotalOther').value
        }
        else {
          this.resultForm.get('pansci').setValue(Number.parseFloat(res.divOfFees.ansci))
          this.resultForm.get('pbiosci').setValue(Number.parseFloat(res.divOfFees.biosci))
          this.resultForm.get('pcemds').setValue(Number.parseFloat(res.divOfFees.cemds))
          this.resultForm.get('phrm').setValue(Number.parseFloat(res.divOfFees.hrm))
          this.resultForm.get('pcropsci').setValue(Number.parseFloat(res.divOfFees.cropsci))
          this.resultForm.get('pengineering').setValue(Number.parseFloat(res.divOfFees.engineering))
          this.resultForm.get('pphysci').setValue(Number.parseFloat(res.divOfFees.physci))
          this.resultForm.get('pvetmed').setValue(Number.parseFloat(res.divOfFees.vetmed))
          this.resultForm.get('pspeech').setValue(Number.parseFloat(res.divOfFees.speech))
          this.resultForm.get('penglish').setValue(Number.parseFloat(res.divOfFees.english))
          this.resultForm.get('pnursing').setValue(Number.parseFloat(res.divOfFees.nursing))
          this.resultForm.get('pccl').setValue(Number.parseFloat(res.divOfFees.ccl))
          this.resultForm.get('prle').setValue(Number.parseFloat(res.divOfFees.rle))
          this.resultForm.get('pinternet').setValue(Number.parseFloat(res.divOfFees.internet))
          this.resultForm.get('pnstp').setValue(Number.parseFloat(res.divOfFees.nstp))
          this.resultForm.get('pojt').setValue(Number.parseFloat(res.divOfFees.ojt))
          this.resultForm.get('pthesis').setValue(Number.parseFloat(res.divOfFees.thesis))
          this.resultForm.get('pstudent').setValue(Number.parseFloat(res.divOfFees.student))
          this.resultForm.get('plate').setValue(Number.parseFloat(res.divOfFees.late))
          this.resultForm.get('presidency').setValue(Number.parseFloat(res.divOfFees.residency))
          this.resultForm.get('pforeignstudent').setValue(Number.parseFloat(res.divOfFees.foreignstudent))
          this.resultForm.get('paddedsubj').setValue(Number.parseFloat(res.divOfFees.addedsubj))
          this.resultForm.get('ppetition').setValue(Number.parseFloat(res.divOfFees.petition))
          this.resultForm.get('ptuition').setValue(Number.parseFloat(res.divOfFees.tuition))
          this.resultForm.get('plibrary').setValue(Number.parseFloat(res.divOfFees.library))
          this.resultForm.get('pmedical').setValue(Number.parseFloat(res.divOfFees.medical))
          this.resultForm.get('ppublication').setValue(Number.parseFloat(res.divOfFees.publication))
          this.resultForm.get('pregistration').setValue(Number.parseFloat(res.divOfFees.registration))
          this.resultForm.get('pguidance').setValue(Number.parseFloat(res.divOfFees.guidance))
          this.resultForm.get('pid').setValue(Number.parseFloat(res.divOfFees.id))
          this.resultForm.get('psfdf').setValue(Number.parseFloat(res.divOfFees.sfdf))
          this.resultForm.get('psrf').setValue(Number.parseFloat(res.divOfFees.srf))
          this.resultForm.get('pathletic').setValue(Number.parseFloat(res.divOfFees.athletic))
          this.resultForm.get('pscuaa').setValue(Number.parseFloat(res.divOfFees.scuaa))
          this.resultForm.get('pdeposit').setValue(Number.parseFloat(res.divOfFees.deposit))
          this.resultForm.get('pcspear').setValue(Number.parseFloat(res.divOfFees.cspear))
          this.resultForm.get('pedfs').setValue(Number.parseFloat(res.divOfFees.edfs))
          this.resultForm.get('ppsyc').setValue(Number.parseFloat(res.divOfFees.psyc))
          this.resultForm.get('ptrm').setValue(Number.parseFloat(res.divOfFees.trm))
          this.resultForm.get('pfishery').setValue(Number.parseFloat(res.divOfFees.fishery))
          this.resultForm.get('ptotalLab').setValue(
            this.resultForm.get('pansci').value +
            this.resultForm.get('pbiosci').value +
            this.resultForm.get('pcemds').value +
            this.resultForm.get('phrm').value +
            this.resultForm.get('pcropsci').value +
            this.resultForm.get('pengineering').value +
            this.resultForm.get('pphysci').value +
            this.resultForm.get('pvetmed').value +
            this.resultForm.get('pspeech').value +
            this.resultForm.get('penglish').value +
            this.resultForm.get('pccl').value +
            this.resultForm.get('pcspear').value +
            this.resultForm.get('pfishery').value +
            this.resultForm.get('ppsyc').value +
            this.resultForm.get('ptrm').value
          )
          this.resultForm.get('ptotalOther').setValue(
            this.resultForm.get('pinternet').value +
            this.resultForm.get('pnstp').value +
            this.resultForm.get('pojt').value +
            this.resultForm.get('pthesis').value +
            this.resultForm.get('prle').value +
            this.resultForm.get('pstudent').value +
            this.resultForm.get('plate').value +
            this.resultForm.get('presidency').value +
            this.resultForm.get('pforeignstudent').value +
            this.resultForm.get('paddedsubj').value +
            this.resultForm.get('ppetition').value +
            this.resultForm.get('ptuition').value +
            this.resultForm.get('psrf').value +
            this.resultForm.get('psfdf').value +
            this.resultForm.get('pdeposit').value +
            this.resultForm.get('plibrary').value +
            this.resultForm.get('pmedical').value +
            this.resultForm.get('ppublication').value +
            this.resultForm.get('pregistration').value +
            this.resultForm.get('pguidance').value +
            this.resultForm.get('pid').value +
            this.resultForm.get('pathletic').value +
            this.resultForm.get('pscuaa').value
          )

          this.ptotalAmount += this.resultForm.get('ptotalLab').value + this.resultForm.get('ptotalOther').value
        }
        //--- PAID DIVISION OF FEES END HERE ---//
      }
    })
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
