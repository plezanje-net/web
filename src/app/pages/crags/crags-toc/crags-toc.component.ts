import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`
        {
          countries {
            name,
            slug,
            crags {
              id
            }
          }
        }
      `,
      errorPolicy: 'all'
    }).valueChanges.subscribe((result: any) => {
      this.countries = [];

      for (let country of result.data.countries) {
        this.countries.push(country);
      }

      this.countries.sort((a, b) => b.crags.length - a.crags.length)
    })
  }

}
