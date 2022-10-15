import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-curriculum-edit',
  templateUrl: './curriculum-edit.component.html',
  styleUrls: ['./curriculum-edit.component.scss']
})
export class CurriculumEditComponent implements OnInit {
  angForm: any;
  id: string;
  curriculum: any = [];

  constructor(
    private fb: FormBuilder,
    private curriculumService: CurriculumService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.id = this.activatedRoute.snapshot.url.toString().split(',').splice(-1).toString()
  }

  ngOnInit(): void {
    this.getCurriculum();
    this.angForm = this.fb.group({
      course: new FormControl({ value: '', disabled: false }, Validators.required),
      coursemajor: new FormControl({ value: '', disabled: false }, Validators.required),
      schoolyear: new FormControl({ value: '', disabled: false }),
      activecurriculum: new FormControl({ value: '', disabled: false })
    })

  }

  getCurriculum() {
    this.curriculumService.getCurriculum(Number(this.id)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.curriculum = res.curriculum;
        //console.log(this.curriculum)
        this.angForm = this.fb.group({
          course: new FormControl({ value: this.curriculum.course, disabled: false }, Validators.required),
          coursemajor: new FormControl({ value: this.curriculum.coursemajor, disabled: false }, Validators.required),
          schoolyear: new FormControl({ value: this.curriculum.schoolyear, disabled: false }),
          activecurriculum: new FormControl({ value: this.activeCurriculumValue(this.curriculum.activecurriculum), disabled: false })
        })
      }
    })
  }

  onEditCurriculum(id: string, angForm: any) {
    if(confirm('Are you sure you want to change this curriculum?')) {
      angForm.get('activecurriculum').setValue(this.setActiveCurriculumValue(angForm.get('activecurriculum').value));

      this.curriculumService.editCurriculum(Number(id), angForm.value).subscribe((res) => {
        if(res){
          this.toastr.success(res.message);
          //console.log(res.user);
          alert('User updated successfully.');
          this.router.navigate([`curriculum/profile/${id}`]);
        }
        else{
          console.log(res);
        }
      })
    }
    else {
      window.location.reload()
    }
  }

  activeCurriculumValue(activeCurriculum: number): string {
    if(activeCurriculum == 1) {
      return 'Yes';
    }
    else {
      return 'No';
    }
  }

  setActiveCurriculumValue(status: string): number {
    if(status == 'Yes') {
      return 1;
    }
    else {
      return 0;
    }
  }
}
