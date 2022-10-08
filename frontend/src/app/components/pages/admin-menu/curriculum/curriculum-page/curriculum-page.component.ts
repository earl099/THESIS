import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-curriculum-page',
  templateUrl: './curriculum-page.component.html',
  styleUrls: ['./curriculum-page.component.scss']
})
export class CurriculumPageComponent implements OnInit {
  id: string;
  curriculum: any = [];
  identifiers: string[] = [
    'Course',
    'Major',
    'School Year Implemented',
    'Active Curriculum'
  ]
  constructor(
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private toastr: ToastrService
  ) {
    this.id = activatedRoute.snapshot.url.toString().split(',').splice(-1).toString()
    //console.log(this.id)
  }

  ngOnInit(): void {
    this.getCurriculum();
  }

  getCurriculum() {
    this.curriculumService.getCurriculum(Number(this.id)).subscribe((res) => {
      if(res) {
        this.toastr.success(res.message);
        this.curriculum = res.curriculum;
        //console.log(this.curriculum)
      }
    })
  }
}
