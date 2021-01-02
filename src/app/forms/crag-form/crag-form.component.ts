import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';

const CountriesQuery = gql`
  query CountriesQuery {
      countries {
        id
        name
        areas {
          id
          name
        }
      }    
  }
`

@Component({
  selector: 'app-crag-form',
  templateUrl: './crag-form.component.html',
  styleUrls: ['./crag-form.component.scss']
})
export class CragFormComponent implements OnInit {

  cragForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    slug: new FormControl("", [Validators.required]),
    lat: new FormControl(""),
    lon: new FormControl(""),
    orientation: new FormControl(""),
    access: new FormControl(""),
    description: new FormControl(""),
    areaId: new FormControl(""),
    countryId: new FormControl("", Validators.required),
    status: new FormControl("", Validators.required),
  })

  loading: boolean = false;

  countries: any[] = [];
  areas: any[] = [];

  statuses: any[] = [
    {
      id: -5,
      label: 'Začasno / zasebno'
    },
    {
      id: 0,
      label: 'Vidno administratorjem'
    },
    {
      id: 5,
      label: 'Vidno prijavljenim'
    },
    {
      id: 10,
      label: 'Vidno vsem'
    }
  ];

  orientations: any[] = [
    {
      id: 'N',
      label: 'Sever'
    },
    {
      id: 'NE',
      label: 'Severovzhod'
    },
    {
      id: 'E',
      label: 'Vzhod'
    },
    {
      id: 'SE',
      label: 'Jugovzhod'
    },
    {
      id: 'S',
      label: 'Jug'
    },
    {
      id: 'SW',
      label: 'Jugozahod'
    },
    {
      id: 'W',
      label: 'Zahod'
    },
    {
      id: 'NW',
      label: 'Severozahod'
    }
  ];

  constructor(
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {countryId: string},
    public matDialogRef: MatDialogRef<CragFormComponent>
  ) { }

  ngOnInit(): void {
    this.apollo.query({
      query: CountriesQuery,
    }).subscribe((result: any) => {
      this.countries = result.data.countries;

      this.cragForm.controls.countryId.valueChanges.subscribe(countryId => {
        this.cragForm.patchValue({
          areaId: null
        });

        this.areas = this.countries.find((country) => country.id == countryId).areas;
      })
  
      this.cragForm.patchValue({
        countryId: this.data.countryId
      });
    })

    
  }

  save(): void {

  }

}
