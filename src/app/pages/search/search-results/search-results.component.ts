import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { SearchGQL, SearchQuery } from 'src/generated/graphql';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  searchString = '';
  searchStringTooShort = false;
  searchResults: SearchQuery['search'];
  loading = true;
  error = null;
  firstNonEmptyTabIndex: number;
  noResults = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchGQL: SearchGQL,
    private layoutService: LayoutService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          this.searchString = params.search;
          this.setBreadcrumbs();

          // query is shorter than 3 non space characters -> no go
          if (this.searchString.replace(/\s/g, '').length < 3) {
            this.searchStringTooShort = true;
            this.loading = false;
            return EMPTY;
          } else {
            // fetch what is searched for and display results
            this.searchStringTooShort = false;
            this.loading = true;
            return this.searchGQL.fetch({
              query: this.searchString,
            });
          }
        })
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.searchResults = result.data.search;

          this.firstNonEmptyTabIndex = [
            this.searchResults.crags,
            this.searchResults.routes,
            this.searchResults.sectors,
            // this.searchResults.users,  // Searching for users is temporarily disabled
            this.searchResults.comments,
          ].findIndex((val) => val.length > 0);

          this.noResults = this.firstNonEmptyTabIndex < 0;
        },
        error: () => {
          this.error = {
            message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
          };
        },
      });
  }

  setBreadcrumbs() {
    this.layoutService.$breadcrumbs.next([
      {
        name: `Rezultati iskanja: "${this.searchString}"`,
      },
    ]);
  }

  highlight(
    text: string,
    searchString: string,
    searchingInHtml = false
  ): string {
    if (!searchString) {
      return text;
    }

    // first escape all special characters. user could be searching for "&" or ">" or "+" and so on...
    searchString = this.searchService.escape(searchString);

    // strip first and last spaces, then replace all (multiple) middle spaces with regex ORs
    searchString = searchString.trim().replace(/\s+/g, '|');

    // convert characters with possible accents to character groups
    searchString = this.searchService.ignoreAccents(searchString);

    // each term should be a start of a string or after a space or after an opening parentheses or after a closing html tag
    searchString = '(?<=^|\\s|>|\\()' + searchString + '';

    // exclude matching text inside html tags
    if (searchingInHtml) {
      searchString += '(?!([^<]+)?>)';
    }

    const regExp = new RegExp(searchString, 'gi');

    return text.replace(regExp, '<span class="highlight">$&</span>');
  }
}
