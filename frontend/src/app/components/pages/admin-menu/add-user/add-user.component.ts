import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  isAdmin: boolean = true;
  hide = true;
  angForm: any;
  userCount: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.angForm = this.fb.group({
      collegeID: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      isAdmin: new FormControl('', Validators.required)
    })
  }

  addForm(angForm: any) {
    if(confirm('Are you sure you want to create the user?')) {
      alert('Account Created.');


      this.userService.addUser(angForm.value).pipe(first()).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message);
        }
      });
      this.userCount = this.getUsers();

      if(this.userCount.length == 1) {
        window.location.href = 'home'
      }
      else {
        const auth = this.userService.getToken()
        if(auth == null) {
          window.location.href = 'home'
        }
        else {
          window.location.href = 'account/list'
        }
      }
    }
    else {
      window.location.reload();
    }

  }


  getUsers(): Observable<any> {
    let users: any
    var subject = new Subject<any>();

    this.userService.getAllUsers().subscribe((res) => {
      users = res.users;
      //console.log(users)
      subject.next(users)
    })

    return subject.asObservable();
  }
}
