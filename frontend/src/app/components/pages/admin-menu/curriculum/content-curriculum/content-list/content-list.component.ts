import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  //YEAR LEVEL
  yearLevel: string[] = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ]

  linkRefID: any;

  //DATA
  FiYearFiSem!: MatTableDataSource<any>;
  FiYearSeSem!: MatTableDataSource<any>;
  SeYearFiSem!: MatTableDataSource<any>;
  SeYearSeSem!: MatTableDataSource<any>;
  ThYearFiSem!: MatTableDataSource<any>;
  ThYearSeSem!: MatTableDataSource<any>;
  ThYearSuSem!: MatTableDataSource<any>;
  FoYearFiSem!: MatTableDataSource<any>;
  FoYearSeSem!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns: string[] = [
    'subjectcode',
    'prerequisite',
    'semester',
    'yearlevel',
    'edit'
  ]


  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private curriculumService: CurriculumService,
    private toastr: ToastrService
  ) {
    this.linkRefID = activatedroute.snapshot.url.toString().split(',').splice(-1).toString()
    //console.log(this.linkRefID)
  }

  ngOnInit(): void {
    this.getCContent();
  }

  redirectTo(cContent: any) {
    this.router.navigate([`/curriculum/content/${cContent.refid}/${cContent.id}`])
  }

  getCContent() {
    const semester = ['FIRST', 'SECOND', 'SUMMER']
    //FIRST YEAR FIRST SEM
    this.curriculumService.getCContentList(this.linkRefID, 1, semester[0]).subscribe((res) => {
      if(res){
        let cContent: any;
        this.toastr.success(res.message);
        cContent = res.cContent;
        console.log(cContent);
        this.FiYearFiSem = new MatTableDataSource(cContent)
        this.FiYearFiSem.paginator = this.paginator;
      }

    })

    //FIRST YEAR SECOND SEM
    this.curriculumService.getCContentList(this.linkRefID, 1, semester[1]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.FiYearSeSem = new MatTableDataSource(cContent);
    })

    //SECOND YEAR FIRST SEM
    this.curriculumService.getCContentList(this.linkRefID, 2, semester[0]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.SeYearFiSem = new MatTableDataSource(cContent)
    })

    //SECOND YEAR SECOND SEM
    this.curriculumService.getCContentList(this.linkRefID, 2, semester[1]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.SeYearSeSem = new MatTableDataSource(cContent)
    })

    //THIRD YEAR FIRST SEM
    this.curriculumService.getCContentList(this.linkRefID, 3, semester[0]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.ThYearFiSem = new MatTableDataSource(cContent)
    })

    //THIRD YEAR SECOND SEM
    this.curriculumService.getCContentList(this.linkRefID, 3, semester[1]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.ThYearSeSem = new MatTableDataSource(cContent)
    })

    //THIRD YEAR SUMMER SEM
    this.curriculumService.getCContentList(this.linkRefID, 3, semester[2]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.ThYearSuSem = new MatTableDataSource(cContent)
    })

    //FOURTH YEAR FIRST SEM
    this.curriculumService.getCContentList(this.linkRefID, 4, semester[0]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.FoYearFiSem = new MatTableDataSource(cContent)
    })

    //FOURTH YEAR SECOND SEM
    this.curriculumService.getCContentList(this.linkRefID, 4, semester[1]).subscribe((res) => {
      let cContent: any;
      this.toastr.success(res.message);
      cContent = res.cContent;
      //console.log(this.cContents);
      this.FoYearSeSem = new MatTableDataSource(cContent)
    })
  }
}
