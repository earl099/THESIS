import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  angForm: any;
  linkCollegeID: string;
  user: any = [];
  newPassword = '';
  isAdmin!: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.linkCollegeID = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString();
  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      collegeID: new FormControl({ value: this.user.collegeID, disabled: true }, Validators.required),
      username: new FormControl({ value: this.user.username, disabled: false }, Validators.required),
      password: new FormControl({ value: this.user.password, disabled: false }, Validators.required),
      email: new FormControl({ value: this.user.email, disabled: false }, [Validators.email, Validators.required]),
      isAdmin: new FormControl({ value: this.setAdminValue(this.user.isAdmin), disabled: true }, Validators.required)
    });

    this.getUser();
  }

  onEditUser(collegeID: string, angForm:any) {
    if(confirm('Are you sure you want to update the details of this account?')) {
      //console.log(angForm.value);
      this.userService.editUser(collegeID, angForm.value).subscribe((res) => {
        if(res){
          this.toastr.success(res.message);
          //console.log(res.user);
          alert('User updated successfully.');
          this.router.navigate([`account/profile/${collegeID}`]);
        }
        else{
          console.log(res);
        }
      });
    }
    else {
      window.location.reload();
    }

  }

  getUser() {
    this.userService.getUser(this.linkCollegeID).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.user = res.user;
        this.angForm = this.fb.group({
          collegeID: new FormControl({ value: this.user.collegeID, disabled: true }, Validators.required),
          username: new FormControl({ value: this.user.username, disabled: false }, Validators.required),
          password: new FormControl({ value: this.user.password, disabled: false }, Validators.required),
          email: new FormControl({ value: this.user.email, disabled: false }, [Validators.email, Validators.required]),
          isAdmin: new FormControl({ value: this.setAdminValue(this.user.isAdmin), disabled: true }, Validators.required)
        });

        this.newPassword = this.user.password.toString();
        this.newPassword = this.newPassword.replace(/./g, '*');
        this.newPassword = this.newPassword.substring(0, 8);
      }

    })
  }

  setAdminValue(isAdmin: boolean): string {
    if(isAdmin) {
      return 'Yes';
    }
    else {
      return 'No';
    }
  }
}
