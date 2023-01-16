import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurriculumService } from 'src/app/services/curriculum.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  columns: string[] = [
    'studentNumber',
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'edit',
    'shiftTo',
    'confirmShift'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //--- DATA FOR DISPLAYING IN THE LIST ---//
  curricula: any = [];
  students: any = [];
  globalVars: any;


  //--- FORMS FOR INSERTING TO THE DATABASE ---//
  shifteeForm: any;
  studentInfoForm: any;

  dataSource!: MatTableDataSource<any>;

  constructor(
    private studentService: StudentService,
    private curriculumService: CurriculumService,
    private variableService: VariableService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {

  }

  ngOnInit(): void {
    this.studentInfoForm = this.fb.group({
      studentNumber: new FormControl(),
      course: new FormControl()
    })

    this.shifteeForm = this.fb.group({
      studentnumber: new FormControl({value: '', disabled: false}),
      coursefrom: new FormControl({value: '', disabled: false}),
      courseto: new FormControl({value: '', disabled: false}),
      semester: new FormControl({value: '', disabled: false}),
      schoolyear: new FormControl({value: '', disabled: false})
    })

    this.getStudents();
    this.getCurricula();
    this.getVariables();
  }

  redirectTo(student: any): void {
    this.router.navigate([`student/profile/${student.studentNumber}`]);
  }

  getStudents() {
    this.studentService.getAllStudents().subscribe((res) => {
      if(res) {
        this.students = res.students;
        this.dataSource = new MatTableDataSource(this.students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.students)
      }
    })
  }

  getCurricula() {
    this.curriculumService.getCurricula().subscribe((res) => {
      if(res) {
        this.curricula = res.curricula;
        //console.log(this.curricula)
      }
    })
  }

  getVariables() {
    this.variableService.getLegend().subscribe((res) => {
      if(res) {
        this.globalVars = res.legend
        //console.log(this.globalVars[0])
      }
    })
  }

  initChangeCourse(studentNumber: any, coursefrom: any, courseto: any) {
    /* CHANGES COURSE OF STUDENT INFO FORM TO UPDATE IN DATABASE */
    this.studentInfoForm.get('studentNumber').setValue(studentNumber)
    this.studentInfoForm.get('course').setValue(courseto)
    //console.log(this.studentInfoForm.value)

    /* INPUTS DATA TO SHIFTEE FORM FOR ADDING IN DATABASE */
    this.shifteeForm.get('studentnumber').setValue(studentNumber)
    this.shifteeForm.get('coursefrom').setValue(coursefrom)
    this.shifteeForm.get('courseto').setValue(courseto)
    this.shifteeForm.get('semester').setValue(this.globalVars[0].semester)
    this.shifteeForm.get('schoolyear').setValue(this.globalVars[0].schoolyear)
    //console.log(this.shifteeForm.value)
  }

  onConfirmShift(studentNumber: any) {
    console.log(this.studentInfoForm.value)
    console.log(this.shifteeForm.value)

    if(this.studentInfoForm.get('studentNumber').value == null || this.shifteeForm.get('studentnumber').value == null) {
      this.toastr.error('Shiftee course is invalid.')
      window.location.reload()
    }
    else {
      if((studentNumber != this.studentInfoForm.get('studentNumber').value) || (studentNumber != this.shifteeForm.get('studentnumber').value)) {
        this.toastr.error('Please refresh the browser.')
      }
      else {
        this.studentService.addShiftee(this.shifteeForm.value).subscribe()

        this.studentService.editCourse(Number(this.studentInfoForm.get('studentNumber').value), this.studentInfoForm.value).subscribe((res) => {
          if(res) {
            this.toastr.success(res.message)
            this.router.navigate(['/student/list'])
          }
        })
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
