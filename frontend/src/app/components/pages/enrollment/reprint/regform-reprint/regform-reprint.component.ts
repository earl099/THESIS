import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-regform-reprint',
  templateUrl: './regform-reprint.component.html',
  styleUrls: ['./regform-reprint.component.scss']
})
export class RegformReprintComponent implements OnInit {
  searchForm: any
  searchVisibility: boolean = true

  resultForm: any
  resultVisibility: boolean = false
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }, Validators.required),
      semester: new FormControl({ value: '', disabled: false }, Validators.required),
      schoolyear: new FormControl({ value: '', disabled: false }, Validators.required)
    })

    this.resultForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      firstname: new FormControl({ value: '', disabled: false }),
      middlename: new FormControl({ value: '', disabled: false }),
      lastname: new FormControl({ value: '', disabled: false }),
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
      fishery: new FormControl({ value: '', disabled: false })
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
      }
    })
    this.enrollmentService.getDivOfFees(
      this.searchForm.get('studentnumber').value,
      this.searchForm.get('semester').value,
      this.searchForm.get('schoolyear').value
      ).subscribe((res) => {
        if(res) {
          this.resultForm.get('ansci').setValue(res.divOfFees.ansci)
          this.resultForm.get('biosci').setValue(res.divOfFees.biosci)
          this.resultForm.get('cemds').setValue(res.divOfFees.cemds)
          this.resultForm.get('hrm').setValue(res.divOfFees.hrm)
          this.resultForm.get('cropsci').setValue(res.divOfFees.cropsci)
          this.resultForm.get('engineering').setValue(res.divOfFees.engineering)
          this.resultForm.get('physci').setValue(res.divOfFees.physci)
          this.resultForm.get('vetmed').setValue(res.divOfFees.vetmed)
          this.resultForm.get('speech').setValue(res.divOfFees.speech)
          this.resultForm.get('english').setValue(res.divOfFees.english)
          this.resultForm.get('nursing').setValue(res.divOfFees.nursing)
          this.resultForm.get('ccl').setValue(res.divOfFees.ccl)
          this.resultForm.get('rle').setValue(res.divOfFees.rle)
          this.resultForm.get('internet').setValue(res.divOfFees.internet)
          this.resultForm.get('nstp').setValue(res.divOfFees.nstp)
          this.resultForm.get('ojt').setValue(res.divOfFees.ojt)
          this.resultForm.get('thesis').setValue(res.divOfFees.thesis)
          this.resultForm.get('student').setValue(res.divOfFees.student)
          this.resultForm.get('late').setValue(res.divOfFees.late)
          this.resultForm.get('residency').setValue(res.divOfFees.residency)
          this.resultForm.get('foreignstudent').setValue(res.divOfFees.foreignstudent)
          this.resultForm.get('addedsubj').setValue(res.divOfFees.addedsubj)
          this.resultForm.get('petition').setValue(res.divOfFees.petition)
          this.resultForm.get('tuition').setValue(res.divOfFees.tuition)
          this.resultForm.get('library').setValue(res.divOfFees.library)
          this.resultForm.get('medical').setValue(res.divOfFees.medical)
          this.resultForm.get('publication').setValue(res.divOfFees.publication)
          this.resultForm.get('registration').setValue(res.divOfFees.registration)
          this.resultForm.get('guidance').setValue(res.divOfFees.guidance)
          this.resultForm.get('id').setValue(res.divOfFees.id)
          this.resultForm.get('sfdf').setValue(res.divOfFees.sfdf)
          this.resultForm.get('athletic').setValue(res.divOfFees.athletic)
          this.resultForm.get('scuaa').setValue(res.divOfFees.scuaa)
          this.resultForm.get('deposit').setValue(res.divOfFees.deposit)
          this.resultForm.get('cspear').setValue(res.divOfFees.cspear)
          this.resultForm.get('edfs').setValue(res.divOfFees.edfs)
          this.resultForm.get('psyc').setValue(res.divOfFees.psyc)
          this.resultForm.get('trm').setValue(res.divOfFees.trm)
          this.resultForm.get('fishery').setValue(res.divOfFees.fishery)
        }
      }
    )
  }

  backToSearch() {
    this.searchVisibility = true
    this.resultVisibility = false
  }
}
