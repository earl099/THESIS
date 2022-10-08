import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-variable-edit',
  templateUrl: './variable-edit.component.html',
  styleUrls: ['./variable-edit.component.scss']
})
export class VariableEditComponent implements OnInit {
  angForm: any
  legend: any = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private varService: VariableService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      semester: new FormControl({ value: '', disabled: true }),
      schoolyear: new FormControl({ value: '', disabled: true }),
      ksemester: new FormControl({ value: '', disabled: true }),
      kschoolyear: new FormControl({ value: '', disabled: false }),
      mycampus: new FormControl({ value: '', disabled: true }),
      hrmohead: new FormControl({ value: '', disabled: false }),
      hrmodesignation: new FormControl({ value: '', disabled: false }),
      registrar: new FormControl({ value: '', disabled: false }),
      registrar_designation: new FormControl({ value: '', disabled: false }),
    });

    this.getLegend();
  }

  newSemester(angForm: any) {
    const semIdentifiers = [
      'FIRST',
      'SECOND',
      'SUMMER'
    ]

    //console.log(angForm.get('semester').value)
    if(confirm('Change Semester?')) {
      //--- CHANGING SEMESTERS ---//
      switch(angForm.get('semester').value) {
        case 'FIRST':
          angForm.get('semester').setValue(semIdentifiers[1]);
          angForm.get('ksemester').setValue(semIdentifiers[0]);
          break;
        case 'SECOND':
          angForm.get('semester').setValue(semIdentifiers[2]);
          angForm.get('ksemester').setValue(semIdentifiers[1]);
          break;
        case 'SUMMER':
          angForm.get('semester').setValue(semIdentifiers[0]);
          angForm.get('ksemester').setValue(semIdentifiers[2]);

          //--- CHANGING SCHOOL YEAR ---//
          let schoolyear = [
            parseInt(
              angForm.get('schoolyear').value.toString().split('-')[0]
            ) + 1,

            parseInt(
              angForm.get('schoolyear').value.toString().split('-')[1]
            ) + 1
          ]

          let kschoolyear = [
            parseInt(
              angForm.get('kschoolyear').value.toString().split('-')[0]
            ) + 1,

            parseInt(
              angForm.get('kschoolyear').value.toString().split('-')[1]
            ) + 1
          ]

          angForm.get('schoolyear').setValue(schoolyear[0] + '-' + schoolyear[1])
          angForm.get('kschoolyear').setValue(kschoolyear[0] + '-' + kschoolyear[1])
          break;
      }

      this.varService.editLegend(angForm.value).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message)
          alert('Global Variables updated successfully');
          this.router.navigate(['dashboard'])
        }
      })
    }
    else {
      window.location.reload()
    }
  }

  onEditVariables(angForm: any) {
    if(confirm('Are you sure you want to modify the global variables?')) {
      angForm.get('hrmohead').setValue(angForm.get('hrmohead').value.toUpperCase());
      angForm.get('hrmodesignation').setValue(angForm.get('hrmodesignation').value.toUpperCase());
      angForm.get('registrar').setValue(angForm.get('registrar').value.toUpperCase());
      angForm.get('registrar_designation').setValue(angForm.get('registrar_designation').value.toUpperCase());

      this.varService.editLegend(angForm.value).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message)
          alert('Global Variables updated successfully');
          this.router.navigate(['dashboard'])
        }
      })
    }
    else {
      window.location.reload()
    }
  }

  getLegend() {
    this.varService.getLegend().subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.legend = res.legend;
        this.angForm = this.fb.group({
          semester: new FormControl({ value: this.legend[0].semester, disabled: false }, Validators.required),
          schoolyear: new FormControl({ value: this.legend[0].schoolyear, disabled: false }, Validators.required),
          ksemester: new FormControl({ value: this.legend[0].ksemester, disabled: false }),
          kschoolyear: new FormControl({ value: this.legend[0].kschoolyear, disabled: false }),
          mycampus: new FormControl({ value: this.legend[0].mycampus, disabled: false }),
          hrmohead: new FormControl({ value: this.legend[0].hrmohead, disabled: false }),
          hrmodesignation: new FormControl({ value: this.legend[0].hrmodesignation, disabled: false }),
          registrar: new FormControl({ value: this.legend[0].registrar, disabled: false }),
          registrar_designation: new FormControl({ value: this.legend[0].registrar_designation, disabled: false }),
        });

        //console.log(this.legend)
      }
    })
  }
}
