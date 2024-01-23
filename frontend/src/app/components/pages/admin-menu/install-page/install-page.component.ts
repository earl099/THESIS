import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VariableService } from 'src/app/services/variable.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { first } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

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
  noUser: boolean = false
  noLegend: boolean = false
  legend: any;
  addForm: any
  // ksemester: any = '';
  // kschoolyear: any = [];

  constructor(
    private router: Router,
    private varService: VariableService,
    private userService: UserService,
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

    this.addForm = this.fb.group({
      collegeSelection: new FormControl(''),
      collegeID: new FormControl('UNIV'),
      username: new FormControl(''),
      email: new FormControl('', Validators.email),
      password: new FormControl(''),
      isAdmin: new FormControl(true)
    })

    this.userService.getAllUsers().subscribe((res) => {
      if(res) {
        let tmpData = res.users
        if(tmpData.length < 1) {
          this.noUser = true
        }
      }
    })
  }


  addAdmin() {
    if(confirm('Are you sure you want to add this account?')) {
      if(
        this.addForm.get('collegeID').value == '' ||
        this.addForm.get('username').value == '' ||
        this.addForm.get('password').value == '' ||
        this.addForm.get('email').value == ''
      )
      {
        this.toastr.error('Please fill out all fields.')
      }
      else {
        this.userService.addUser(this.addForm.value).subscribe((res) => {
          if(res) {
            this.varService.getLegend().subscribe((res) => {
              if(res) {
                let tmpData = res.legend
                if(tmpData.length < 1) {
                  this.noLegend = true
                  this.noUser = false
                }
                else {
                  this.router.navigate(['/login'])
                }
              }
            })
          }
        })
      }
    }
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
          this.router.navigate(['/login'])
        }
      })
    }
  }
}
