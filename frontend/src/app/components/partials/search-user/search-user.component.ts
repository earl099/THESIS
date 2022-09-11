import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {
  searchTerm = '';
  constructor(activatedRoute: ActivatedRoute, private router: Router, private dataService: UserService) {
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }

  ngOnInit(): void {
  }

  search(term: string): void {
    if(term) {
      this.dataService.getUser(term);
      this.router.navigateByUrl('/account/search/' + term);
    }

    if(term === '') this.router.navigateByUrl('account/list');
  }
}
