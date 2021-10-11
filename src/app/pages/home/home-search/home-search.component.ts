import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { debounceTime, filter, startWith } from 'rxjs/operators';
import { HomeSearchGQL, HomeSearchQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})
export class HomeSearchComponent implements OnInit {
  searchControl = new FormControl();
  searchResults: HomeSearchQuery['search'];

  constructor(private homeSearchGQL: HomeSearchGQL, private router: Router) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value) => value.length >= 3)
      )
      .subscribe((query) => {
        this.homeSearchGQL
          .fetch({
            query: query,
          })
          .toPromise()
          .then((result) => {
            this.searchResults = result.data.search;
          });
      });
  }

  displayFn(result: any): string {
    return result != null && result.name ? result.name : 'no result name';
  }

  select(event: MatAutocompleteSelectedEvent): void {
    const result = event.option.value;
    if (result.type == 'crag') {
      this.router.navigate([
        '/plezalisca',
        result.crag.country.slug,
        result.crag.slug,
      ]);
    }

    if (result.type == 'route') {
      this.router.navigate([
        '/plezalisca',
        result.route.crag.country.slug,
        result.route.crag.slug,
        result.route.id,
      ]);
    }
  }
}
