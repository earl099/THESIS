import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurriculumService } from 'src/app/services/curriculum.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //YEAR LEVEL
  yearLevel: string[] = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ]

  linkRefID: any;

  //DATASOURCE
  cContent: any;
  cContent1: any;
  cContent2: any;
  cContent3: any;
  cContent4: any;
  cContent5: any;
  cContent6: any;
  cContenT7: any;
  cContent8: any;

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
        this.toastr.success(res.message);
        this.cContent = res.cContent;
        console.log(this.cContent);
        this.FiYearFiSem = new MatTableDataSource(this.cContent)
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
