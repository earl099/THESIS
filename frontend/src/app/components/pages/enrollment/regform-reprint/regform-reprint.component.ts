import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-regform-reprint',
  templateUrl: './regform-reprint.component.html',
  styleUrls: ['./regform-reprint.component.scss']
})
export class RegformReprintComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    
  ) { }

  ngOnInit(): void {
  }

}
