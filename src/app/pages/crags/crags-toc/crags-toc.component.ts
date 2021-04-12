import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CountriesTocGQL, CountriesTocQuery, Country } from '../../../../generated/graphql';

@Component({
  selector: 'app-crags-toc',
  templateUrl: './crags-toc.component.html',
  styleUrls: ['./crags-toc.component.scss']
})
export class CragsTocComponent implements OnInit {

  @Input() country: Country;
  @Input('area') areaId: string = '';

  countries: CountriesTocQuery['countries'];

  showAllCountries: boolean = false;

  constructor(private router: Router, private countriesTocGQL: CountriesTocGQL) { }

  ngOnInit(): void {
    this.countriesTocGQL.watch().valueChanges.subscribe((result) => this.countries = result.data.countries);
  }

  changeArea(id: string) {
    if (id != null) {
      this.router.navigate([
        '/plezalisca',
        this.country.slug,
        { area: id }
      ])
    } else {
      this.router.navigate([
        '/plezalisca',
        this.country.slug
      ])
    }
  }

  changeCountry(slug: string) {
    this.router.navigate([
      '/plezalisca',
      slug
    ])
  }

}
