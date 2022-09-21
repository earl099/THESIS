import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.scss']
})
export class SearchStudentComponent implements OnInit {
  searchTerm = '';
  constructor(activatedRoute: ActivatedRoute, private router: Router) {
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm) {
        this.searchTerm = params.searchTerm;
        
      }

    });
  }

  ngOnInit(): void {
  }

  search(term: string): void {
    if(term) this.router.navigateByUrl('/student/search/' + term);
    if(term === '') this.router.navigateByUrl('student/list');
  }

}
