import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import {
  Comment,
  Crag,
  Route,
  SearchAutoCompleteGQL,
  SearchResults,
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
    private searchAutoCompleteGQL: SearchAutoCompleteGQL
  ) {}

  searchForm = new FormGroup({
    searchControl: new FormControl(''),
  });
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  searchString = '';
  searchResults: SearchResults;
  error = false;

  subscription: Subscription;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.searchForm.controls.searchControl.setValue(params.search);
    });

    this.subscription = this.searchForm.controls.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value) => value.length >= 3),
        distinctUntilChanged(),
        switchMap((searchString: string) => {
          this.searchString = searchString;
          this.error = false;
          return this.searchAutoCompleteGQL
            .fetch({
              searchString,
            })
            .pipe(
              catchError(() => {
                this.error = true;
                return EMPTY;
              })
            );
        })
      )
      .subscribe({
        next: (result) => {
          this.searchResults = <SearchResults>result.data.search;
        },
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
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
