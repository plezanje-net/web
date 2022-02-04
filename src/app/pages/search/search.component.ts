import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, filter, take } from 'rxjs/operators';
import {
  Comment,
  Crag,
  Route,
  SearchGQL,
  SearchQuery,
  Sector,
  User,
} from 'src/generated/graphql';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchGQL: SearchGQL
  ) {}

  searchForm = new FormGroup({
    searchControl: new FormControl(''),
  });
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  searchString = '';
  searchResults: SearchQuery['search'];

  fvcSubscription: Subscription;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.searchForm.controls.searchControl.setValue(params.search);
    });

    this.fvcSubscription = this.searchForm.controls.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value) => value.length >= 3)
      )
      .subscribe((searchString) => {
        this.searchString = searchString;
        this.searchGQL
          .fetch({
            query: searchString,
          })
          .pipe(take(1))
          .subscribe((result) => {
            this.searchResults = result.data.search;
          });
      });
  }

  onSubmit() {
    this.autocompleteTrigger.closePanel();
    this.router.navigate([
      '/iskanje',
      this.searchForm.controls.searchControl.value,
    ]);
  }

  onClear() {
    this.searchForm.controls.searchControl.setValue('');
  }

  // should never come to this, because onOptionSelected is triggered and user is redirected before this happens
  // using fatarrow to get the correct 'this' reference
  displayFn = (optionValue: Crag | Route | Sector | User | Comment) => {
    // on load -> value is undefined or is a string from the input
    if (!optionValue || !optionValue.__typename) {
      return this.searchForm.controls.searchControl.value;
    }

    switch (optionValue.__typename) {
      case 'Crag':
      case 'Route':
      case 'Sector':
        return optionValue.name;
      case 'User':
        return optionValue.fullName;
      case 'Comment':
      default:
        return this.searchForm.controls.searchControl.value; // just keep what is already typed in the input
    }
  };

  // when an option is selected from the dropdown, navigate to the corresponding entity
  onOptionSelected(optionValue: Route | User | Crag | Sector | Comment) {
    switch (optionValue.__typename) {
      case 'Crag':
        const crag = optionValue;
        this.router.navigate(['/plezalisce', crag.slug]);
        break;

      case 'Route':
        const route = optionValue;
        this.router.navigate([
          '/plezalisce',
          route.crag.slug,
          'smer',
          route.slug,
        ]);
        break;

      case 'Sector':
        const sector = optionValue;
        this.router.navigate(['/plezalisce', sector.crag.slug]);
        break;

      case 'User':
        const user = optionValue;
        this.router.navigate(['/uporabniki', user.fullName]);
        break;

      case 'Comment':
        const comment = optionValue;
        if (comment?.route) {
          this.router.navigate([
            '/plezalisce',
            comment.route.crag.slug,
            'smer',
            comment.route.slug,
          ]);
        } else {
          this.router.navigate(['/plezalisce', comment.crag.slug]);
        }
    }
  }

  // truncate to part of comment that contains at least first search term
  truncateComment(text: string) {
    // get rid of html in comment
    const plainText = text.replace(/<[^>]*>/g, '');

    // keep only first word/term
    let searchTerm = this.searchString.split(' ')[0];

    // // replace csz in searchString with character sets so that all accents are matched
    searchTerm = searchTerm.replace(/[cčć]/gi, '[cčć]');
    searchTerm = searchTerm.replace(/[sš]/gi, '[sš]');
    searchTerm = searchTerm.replace(/[zž]/gi, '[zž]');

    // should start with nothing or a space
    searchTerm = '(?<![^\\s])' + '(' + searchTerm + ')';
    const regExp = new RegExp(searchTerm, 'gi');

    // cut begining of comment if first matched term more than 5 chars 'deep'
    const match = regExp.exec(plainText);
    if (match && match.index > 5) {
      return '...' + plainText.substring(match.index - 5);
    }
    return plainText;
  }

  ngOnDestroy() {
    this.fvcSubscription.unsubscribe();
  }
}

// TODO: going back from link -> reselect last selected tab ?

// TODO: link to sector -> sector anchors

// TODO: link to comment -> anchor

// TODO: what is comment status. currently all statuses are 'active'

// TODO: sticky headers on results lists?

// TODO: common words such as 'smer' yield a lot of results. pagination/load more?
