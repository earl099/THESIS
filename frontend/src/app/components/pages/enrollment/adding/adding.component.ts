import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.scss']
})
export class AddingComponent implements OnInit {
  //VARIABLE FOR DEFAULT VALUE OF SEMESTER AND SCHOOLYEAR
  globalVar: any

  //VARIABLES FOR SEARCH AND ITS VISIBILITY
  searchForm: any
  searchVisibility: boolean = true

  //SCHEDULE LIST
  schedControl = new FormControl('0')
  filteredSched!: Observable<any>
  scheduleList: Array<any> = []

  //SCHEDULES LIST FOR ADDING SUBJECTS
  addedSchedule: any
  addedScheduleList: Array<any> = []

  //VARIABLES FOR ADDING STUDENT
  resultForm: any
  resultVisibility: boolean = false
  totalAmount: number = 0
  pTotalAmount: number = 0
  date = new Date()

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private scheduleService: ScheduleService,
    private variableService: VariableService
  ) {
    this.filteredSched = this.schedControl.valueChanges.pipe(
      startWith(''),
      map(sched => (sched ? this._filterSched(sched) : this.scheduleList.slice()))
    )
  }

  ngOnInit(): void {
    //INITIALIZING SEARCHFORM OBJECT
    this.searchForm = this.fb.group({
      studentnumber: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      schoolyear: new FormControl({ value: '', disabled: false })
    })

    //SETTING THE DEFAULT VALUE OF SEMESTER AND SCHOOL
    this.variableService.getLegend().subscribe((res) => {
      if(res){
        this.globalVar = res.legend
        this.searchForm.get('studentnumber').setValue('')
        this.searchForm.get('semester').setValue(this.globalVar[0].semester)
        this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
      }

    })

    //INITIALIZING ADDED SUBJECTS FOR DISPLAYING DATA
    this.addedSchedule = this.fb.group({
      schedcode: new FormControl({ value: '', disabled: false }),
      subjectCode: new FormControl({ value:'', disabled: false }),
      isShown: new FormControl({ value: true, disabled: false }),
      isTextResult: new FormControl({ value: false, disabled: false })
    })

    //INITIALIZING RESULTFORM OBJECT FOR DIVSION OF FEES
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


  }


  generateData() {
    this.generateScheduleList()
  }

  generateScheduleList() {
    //SETTING VALUES FOR SCHEDULE DATA AND PUSHING IT TO SCHEDULE LIST
    if(
      this.searchForm.get('studentnumber').value == null ||
      this.searchForm.get('studentnumber').value == ''
    ) {
      this.toastr.error('Enter a Student Number.')
    }
    else {
      this.studentService.getStudent(this.searchForm.get('studentnumber').value).subscribe((res) => {
        if(res) {
          this.scheduleService.getScheduleBySemSY(
            this.searchForm.get('semester').value,
            this.searchForm.get('schoolyear').value
          )
          .subscribe((res) => {
            if(res) {
              this.resultVisibility = true
              this.searchVisibility = false
              let tmpData = res.schedule

              for(let i = 0; i < tmpData.length; i++) {
                //console.log(scheduleData.value)
                this.scheduleList.push(tmpData[i])
              }
              console.log(this.scheduleList)
            }
          })
        }
      })

    }

  }

  //FUNCTION FOR SEARCHING AND ADDING TO ADDED SCHEDULE FORMARRAY
  addSubject() {
    if(this.schedControl.value != undefined || this.schedControl.value == ''){
      if(this.addedSchedule.get('isShown').value == false || this.addedScheduleList.length == 0){
        this.schedControl.reset()
        this.addedSchedule.get('schedcode').setValue('')
        this.addedSchedule.get('subjectCode').setValue('')
        this.addedSchedule.get('isShown').setValue(true)
        this.addedSchedule.get('isTextResult').setValue(false)
        this.addedScheduleList.push(this.addedSchedule.value)
        console.log(this.addedScheduleList)
      }
      else {
        this.toastr.error('Please press Search before adding another subject.')
      }
    }
    else {
      this.toastr.error('Add a subject first.')
    }
  }


  searchAndAdd(schedcode: any) {
    try {
      this.scheduleService.getSchedule(schedcode).subscribe((res) => {
        if(res) {
          this.addedSchedule.get('schedcode').setValue(res.schedule.schedcode)
          this.addedSchedule.get('subjectCode').setValue(res.schedule.subjectCode)
          this.addedSchedule.get('isShown').setValue(false)
          this.addedSchedule.get('isTextResult').setValue(true)

          this.addedScheduleList.fill(
            {
              studentnumber: this.searchForm.get('studentnumber').value,
              schedcode: this.addedSchedule.get('schedcode').value,
              edate: String(
                this.date.getFullYear() + '-' +
                (this.date.getMonth() + 1) + '-' +
                this.date.getDate() + ' ' +
                this.date.getHours() + ':' +
                this.date.getMinutes() + ':' +
                this.date.getSeconds()),
              semester: this.searchForm.get('semester').value,
              schoolyear: this.searchForm.get('schoolyear').value,
              isShown: this.addedSchedule.get('isShown').value,
              isTextResult: this.addedSchedule.get('isTextResult').value,
              subjectCode: this.addedSchedule.get('subjectCode').value,
              subjNum: this.addedScheduleList.length
            },
            this.addedScheduleList.length - 1
          )
          console.log(this.addedScheduleList)
        }
      })
      console.log(schedcode)
    } catch (error) {
      console.log(error)
    }

  }

  //FUNCTION FOR FINALIZING ADDED SCHEDULES
  finalAdd() {
    if(this.addedScheduleList.length < 1) {
      this.toastr.error('Please add a subject.')
    }
    else if(!this.addedSchedule.get('isShown').value && this.addedScheduleList.length < 1) {
      this.toastr.error('All Subjects must be searched before reevaluation.')
    }
    else {
      for (let i = 0; i < this.addedScheduleList.length; i++) {
        if(!this.addedScheduleList[i].isTextResult) {
          this.toastr.error('All Subjects must be searched.')
          break
        }
        else {
          try{
            let json = JSON.parse(JSON.stringify(this.addedScheduleList[i]))
            console.log(json)
            this.enrollmentService.addSubjTransaction(
              this.searchForm.get('studentnumber').value,
              this.searchForm.get('semester').value,
              this.searchForm.get('schoolyear').value,
              json
            ).subscribe()
            this.toastr.success('Added Subject/s Successfully.')

          }
          catch (error) {
            this.toastr.error('Error Adding Subject')
          }

        }
      }
      //this.backToSearch()
    }


  }

  backToSearch() {
    this.resultVisibility = false
    this.searchVisibility = true
    this.searchForm.get('studentnumber').setValue('')
    this.searchForm.get('semester').setValue(this.globalVar[0].semester)
    this.searchForm.get('schoolyear').setValue(this.globalVar[0].schoolyear)
    this.scheduleList.splice(0, this.scheduleList.length)
    this.addedScheduleList.splice(0, this.addedScheduleList.length)
    //console.log(this.scheduleList)
  }

  //FOR FILTERING THE SCHEDCODE
  private _filterSched(value: string): any[] {
    const filterValue = value.toLowerCase()
    return this.scheduleList.filter(sched => sched.schedcode.toLowerCase().includes(filterValue))
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
