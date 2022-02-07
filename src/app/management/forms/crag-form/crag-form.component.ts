import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import { Registry } from 'src/app/types/registry';
import {
  Country,
  Crag,
  CreateActivityMutation,
  GradingSystem,
  ManagementCragFormGetCountriesGQL,
  ManagementCragFormGetCountriesQuery,
  ManagementCreateCragGQL,
  ManagementCreateCragMutation,
  ManagementUpdateCragGQL,
} from 'src/generated/graphql';
import { GradingSystemsService } from '../../../shared/services/grading-systems.service';

@Component({
  selector: 'app-crag-form',
  templateUrl: './crag-form.component.html',
  styleUrls: ['./crag-form.component.scss'],
})
export class CragFormComponent implements OnInit, OnDestroy {
  @Input() crag: Crag;

  cragForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('sport', [Validators.required]),
    lat: new FormControl(),
    lon: new FormControl(),
    orientation: new FormControl(),
    access: new FormControl(),
    description: new FormControl(),
    areaId: new FormControl(),
    countryId: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    defaultGradingSystemId: new FormControl(null, Validators.required),
  });

  loading: boolean = false;

  countries: ManagementCragFormGetCountriesQuery['countries'] = [];
  areas: ManagementCragFormGetCountriesQuery['countries'][0]['areas'] = [];

  gradingSystems: GradingSystem[];

  subsriptions: Subscription[] = [];

  types: Registry[] = [
    {
      value: 'sport',
      label: 'Športno / balvani / dolge športne',
    },
    {
      value: 'alpine',
      label: 'Alpinizem',
    },
  ];

  statuses: Registry[] = [
    // {
    //   value: 'user',
    //   label: 'Začasno / zasebno',
    // },
    // {
    //   value: 'proposal',
    //   label: 'Predlagaj administratorju',
    // },
    {
      value: 'admin',
      label: 'Vidno administratorjem',
    },
    {
      value: 'archive',
      label: 'Arhivirano',
    },
    {
      value: 'hidden',
      label: 'Vidno prijavljenim',
    },
    {
      value: 'public',
      label: 'Vidno vsem',
    },
  ];

  orientations: Registry[] = [
    {
      value: 'N',
      label: 'Sever',
    },
    {
      value: 'NE',
      label: 'Severovzhod',
    },
    {
      value: 'E',
      label: 'Vzhod',
    },
    {
      value: 'SE',
      label: 'Jugovzhod',
    },
    {
      value: 'S',
      label: 'Jug',
    },
    {
      value: 'SW',
      label: 'Jugozahod',
    },
    {
      value: 'W',
      label: 'Zahod',
    },
    {
      value: 'NW',
      label: 'Severozahod',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private gradingSystemsService: GradingSystemsService,
    private countriesGQL: ManagementCragFormGetCountriesGQL,
    private updateCragGQL: ManagementUpdateCragGQL,
    private createCragGQL: ManagementCreateCragGQL,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    if (this.crag != null) {
      this.cragForm.patchValue({
        ...this.crag,
        countryId: this.crag.country?.id,
        areaId: this.crag.area?.id,
        defaultGradingSystemId: this.crag.defaultGradingSystem?.id,
      });
    }

    this.gradingSystemsService.getGradingSystems().then((gradingSystems) => {
      this.gradingSystems = <GradingSystem[]>gradingSystems;
    });

    const routeSub = this.activatedRoute.params.subscribe((params) => {
      if (params.country != null) {
        this.cragForm.patchValue({
          countryId: params.country,
        });
      }
    });
    this.subsriptions.push(routeSub);

    this.countriesGQL
      .fetch()
      .pipe(take(1))
      .subscribe((result) => {
        this.countries = result.data.countries;
        this.countryChanged(this.cragForm.value.countryId);
      });

    const countrySub = this.cragForm.controls.countryId.valueChanges.subscribe(
      (v) => {
        this.countryChanged(v);
      }
    );
    this.subsriptions.push(countrySub);
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach((sub) => sub.unsubscribe());
  }

  countryChanged(value: string) {
    const c = this.countries.find((country) => country.id == value);

    if (c != null) {
      this.areas = c != null ? c.areas : [];
    }

    if (!this.areas.find((a) => a.id == this.cragForm.value.areaId)) {
      this.cragForm.patchValue({ areaId: null });
    }
  }

  formatCoordinate(event: { target: { value: string } }, controlName: string) {
    this.cragForm.patchValue({
      [controlName]: event.target.value
        ? Math.round(parseFloat(event.target.value) * 100000) / 100000
        : null,
    });
  }

  save(): void {
    this.loading = true;

    const value =
      this.crag != null
        ? { ...this.cragForm.value, id: this.crag.id }
        : { ...this.cragForm.value };

    this.cragForm.disable();

    let mutation: Observable<MutationResult>;

    if (this.crag != null) {
      mutation = this.updateCragGQL.mutate({ input: value });
    } else {
      mutation = this.createCragGQL.mutate({ input: value });
    }

    mutation.pipe(take(1)).subscribe({
      next: (result) => {
        this.snackBar.open('Podatki o plezališču so shranjeni', null, {
          duration: 3000,
        });

        this.apollo.client.resetStore().then(() => {
          if (this.crag == null) {
            this.router.navigate([
              '/admin/uredi-plezalisce',
              result.data.createCrag.id,
            ]);
          }

          this.cragForm.enable();
          this.cragForm.markAsPristine();
          this.loading = false;
        });
      },
      error: () => {
        this.loading = false;
        this.cragForm.enable();
        this.snackBar.open(
          'Podatkov o plezališču ni bilo mogoče shraniti',
          null,
          { panelClass: 'error', duration: 3000 }
        );
      },
    });
  }
}
