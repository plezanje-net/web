import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { gql, Apollo } from 'apollo-angular';

@Component({
  selector: 'app-crags-toc',
  templateUrl: './crags-toc.component.html',
  styleUrls: ['./crags-toc.component.scss']
})
export class CragsTocComponent implements OnInit {

  @Input() country: any;
  @Input('area') areaId: string = '';

  countries: any[];

  showAllCountries: boolean = false;

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`
        {
          countries(input: {
            hasCrags: true,
            orderBy: {
              field: "nrCrags",
              direction: "DESC"
            }
          }) {
            name,
            slug,
            nrCrags
          }
        }
      `,
      errorPolicy: 'all'
    }).valueChanges.subscribe((result: any) => this.countries = result.data.countries)
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
