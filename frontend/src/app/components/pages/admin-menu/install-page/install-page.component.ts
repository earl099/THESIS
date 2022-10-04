import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VariableService } from 'src/app/services/variable.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { first } from 'rxjs';

@Component({
  selector: 'app-install-page',
  templateUrl: './install-page.component.html',
  styleUrls: ['./install-page.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class InstallPageComponent implements OnInit {
  legend: any;
  // ksemester: any = '';
  // kschoolyear: any = [];




  constructor(
    private router: Router,
    private varService: VariableService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.legend = this.fb.group({
      semester: new FormControl('', Validators.required),
      schoolyear: new FormControl('', Validators.required),
      mycampus: new FormControl('', Validators.required),
      hrmohead: new FormControl(),
      hrmodesignation: new FormControl(),
      registrar: new FormControl(),
      registrar_designation: new FormControl(),
      limitunits: new FormControl(),
      internetpayment: new FormControl(),
      ksemester: new FormControl(''),
      kschoolyear: new FormControl('')
    })


  }


  addLegend(legend: any) {
    //FOR GETTING THE PREVIOUS SEMESTER
    switch(legend.get('semester').value) {
      case 'FIRST':
        var tmp = 'SUMMER';
        legend.get('ksemester').setValue(tmp);
        break;
      case 'SECOND':
        tmp = 'FIRST';
        legend.get('ksemester').setValue(tmp);
        break;
      case 'SUMMER':
        tmp = 'SECOND';
        legend.get('ksemester').setValue(tmp);
        break;
    }

    //--- FOR GETTING THE PREVIOUS SCHOOL YEAR ---//
    var tmp1 = [
      parseInt(
        legend.get('schoolyear').value.toString().split('-')[0]
      ) - 1,
      parseInt(
        legend.get('schoolyear').value.toString().split('-')[1]
      ) - 1
    ]
    legend.get('kschoolyear').setValue(tmp1[0] + '-' + tmp1[1])

    //--- AFTER CONFIRMING, REDIRECTS TO ACCOUNT CREATION PAGE ---//
    if(confirm('Confirm setting the values?')) {
      this.varService.addLegend(legend.value).pipe(first()).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message);
        }
      })
      console.log(legend.value)
      alert('Redirecting to Admin Account Creation');
      window.location.href = 'account/add';
    }
  }
}
