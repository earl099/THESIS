import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  isAdmin: boolean = true;
  hide = true;
  angForm: any;

  constructor(private fb: FormBuilder, private dataService: UserService, private router: Router) {  }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      collegeID: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      isAdmin: [this.isAdmin, Validators.required]
    })
  }

  addForm(angForm:any) {
    this.dataService.addUser(angForm.value).pipe(first()).subscribe(() => {
        if(confirm('Are you sure you want to create the user?')) {
          alert('Account Created.');
          this.router.navigate(['account/list']);
        }
        else {
          window.location.reload();
        }

      });
  }

}
