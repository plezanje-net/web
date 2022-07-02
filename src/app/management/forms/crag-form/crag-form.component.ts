import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@sentry/angular';
import { Apollo, MutationResult } from 'apollo-angular';
import { filter, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Registry } from 'src/app/types/registry';
import {
  Crag,
  GradingSystem,
  ManagementCragFormGetCountriesGQL,
  ManagementCragFormGetCountriesQuery,
  ManagementCreateCragGQL,
  ManagementDeleteCragGQL,
  ManagementUpdateCragGQL,
} from 'src/generated/graphql';
import { GradingSystemsService } from '../../../shared/services/grading-systems.service';
import { ContributionService } from '../../pages/contributions/contribution/contribution.service';

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
    isHidden: new FormControl(false),
    defaultGradingSystemId: new FormControl(null, Validators.required),
    publishStatus: new FormControl('draft'),
  });

  loading: boolean = false;

  countries: ManagementCragFormGetCountriesQuery['countries'] = [];
  areas: ManagementCragFormGetCountriesQuery['countries'][0]['areas'] = [];

  gradingSystems: GradingSystem[];
  subscriptions: Subscription[] = [];

  user: User;

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
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private gradingSystemsService: GradingSystemsService,
    private countriesGQL: ManagementCragFormGetCountriesGQL,
    private updateCragGQL: ManagementUpdateCragGQL,
    private createCragGQL: ManagementCreateCragGQL,
    private deleteCragGQL: ManagementDeleteCragGQL,
    private apollo: Apollo,
    public contributionService: ContributionService
  ) {}

  ngOnInit(): void {
    this.cragForm.disable();

    const userSub = this.authService.currentUser.subscribe((user) => {
      this.user = user;

      if (
        this.user.roles.includes('admin') ||
        !this.crag ||
        this.crag.publishStatus === 'draft'
      ) {
        this.cragForm.enable();
      }
    });
    this.subscriptions.push(userSub);

    const cragPublishStatusSub =
      this.contributionService.publishStatusChanged$.subscribe(
        (newPublishStatus: string) => {
          // We have 2 special cases here:
          //  1) An editor rejected a crag which he now cannot access anymore -> should redirect to Contributions page
          if (
            this.user.roles.includes('admin') &&
            newPublishStatus === 'draft'
          ) {
            this.router.navigate(['/urejanje/prispevki']);
          }

          //  2) A normal user pushed the crag into review -> should disable the form for editing
          if (
            !this.user.roles.includes('admin') &&
            newPublishStatus === 'in_review'
          ) {
            this.cragForm.disable();
          }
        }
      );
    this.subscriptions.push(cragPublishStatusSub);

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
    this.subscriptions.push(routeSub);

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
    this.subscriptions.push(countrySub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
              '/urejanje/uredi-plezalisce',
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

  deleteCrag() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message:
            'Si prepričan_a, da želiš izbrisati to plezališče in vse sektorje in smeri v njem?',
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((value) => value != null),
        tap(() => {
          this.loading = true;
        }),
        switchMap(() => this.deleteCragGQL.mutate({ id: this.crag.id }))
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Plezališče je bilo izbrisano', null, {
            duration: 3000,
          });
          this.apollo.client.resetStore();
          this.router.navigate(['/plezalisca']);
        },
        error: (error) => {
          if (error.message === 'crag_has_log_entries') {
            error.message =
              'Plezališča ni mogoče izbrisati, ker so v njem zabeležene aktivnosti.';
          }
          this.snackBar.open(error.message, null, {
            panelClass: 'error',
            duration: 3000,
          });
          this.loading = false;
        },
      });
  }

  /**
   * A crag can be deleted if it is still a draft. An editor can also delete a crag but not one that was pushed to review.
   */
  canDelete() {
    return (
      this.crag?.publishStatus === 'draft' ||
      (this.user.roles.includes('admin') &&
        this.crag?.publishStatus === 'published')
    );
  }
}
