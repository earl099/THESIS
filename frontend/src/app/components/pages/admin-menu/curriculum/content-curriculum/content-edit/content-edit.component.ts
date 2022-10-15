import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent implements OnInit {
  angForm: any
  refid: any
  id: any
  cContent: any

  constructor(
    private fb: FormBuilder,
    private curriculumService: CurriculumService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    let route = this.activatedRoute.snapshot.url.toString().split(',');
    this.refid = route[2];
    this.id = route[3];
  }

  ngOnInit(): void {
    this.getCContent();
    this.angForm = this.fb.group({
      subjectcode: new FormControl({ value: '', disabled: false }),
      prerequisite: new FormControl({ value: '', disabled: false }),
      semester: new FormControl({ value: '', disabled: false }),
      yearlevel: new FormControl({ value: '', disabled: false }),
      active: new FormControl({ value: '', disabled: false })
    })
  }

  getCContent() {
    this.curriculumService.getCContent(Number(this.id)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message)
        this.cContent = res.cContent
        console.log(this.cContent)
        this.angForm.get('subjectcode').setValue(this.cContent.subjectcode)
        this.angForm.get('prerequisite').setValue(this.cContent.prerequisite)
        this.angForm.get('semester').setValue(this.cContent.semester)
        this.angForm.get('yearlevel').setValue(this.cContent.yearlevel.toString())
        this.angForm.get('active').setValue(this.cContent.active.toString())
      }
    })
  }

  onEditCContent(refid: any, angForm: any) {
    if(confirm('Are you sure you want to edit this subject?')) {
      angForm.get('yearlevel').setValue(Number(angForm.get('yearlevel').value))
      angForm.get('active').setValue(Number(angForm.get('active').value))

      this.curriculumService.editCContent(this.refid, this.id, angForm.value).subscribe((res) => {
        if(res) {
          this.toastr.success(res.message)
          alert('Subject updated successfully.')
          this.router.navigate([`/curriculum/content/${this.refid}/${this.id}`])
        }
      })
    }
    else {
      window.location.reload();
    }
  }
}
