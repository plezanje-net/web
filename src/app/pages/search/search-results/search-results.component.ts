import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
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
  firstNonEmptyTabIndex: number;
  noResults = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchGQL: SearchGQL,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.searchString = params.search;
      this.setBreadcrumbs();

      // query is shorter than 3 non space characters -> no go
      if (this.searchString.replace(/\s/g, '').length < 3) {
        this.searchStringTooShort = true;
        this.loading = false;
      } // fetch what is searched for and display results
      else {
        this.searchStringTooShort = false;
        this.loading = true;
        this.searchGQL
          .fetch({
            query: this.searchString,
          })
          .subscribe((result) => {
            this.loading = false;
            this.searchResults = result.data.search;

            this.firstNonEmptyTabIndex = [
              this.searchResults.crags,
              this.searchResults.routes,
              this.searchResults.sectors,
              this.searchResults.users,
              this.searchResults.comments,
            ].findIndex((val) => val.length > 0);

            this.noResults = this.firstNonEmptyTabIndex < 0;
          });
      }
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

    // strip first and last spaces, then replace all (multiple) middle spaces with single ORs
    searchString = searchString.trim().replace(/\s+/g, '|');

    // replace csz in search terms with character sets so that all accents are matched
    searchString = searchString.replace(/[cčć]/gi, '[cčć]');
    searchString = searchString.replace(/[sš]/gi, '[sš]');
    searchString = searchString.replace(/[zž]/gi, '[zž]');

    searchString = '(?<![^\\s])' + '(' + searchString + ')';

    // exclude matching text inside html tags
    if (searchingInHtml) {
      searchString += '(?!([^<]+)?>)';
    }

    const regExp = new RegExp(searchString, 'gi');

    return text.replace(regExp, '<span class="highlight">$&</span>');
  }
}
