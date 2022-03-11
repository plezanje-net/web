import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, Subject, switchMap } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { GenderizeVerbPipe } from 'src/app/shared/pipes/genderize-verb.pipe';
import { DataError } from 'src/app/types/data-error';
import { Registry } from 'src/app/types/registry';
import {
  ActivityEntryGQL,
  ActivityEntryQuery,
  ActivityRoute,
  DeleteActivityRouteGQL,
  namedOperations,
} from 'src/generated/graphql';
import { AuthService } from '../../../auth/auth.service';
import { ACTIVITY_TYPES } from '../../../common/activity.constants';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-activity-entry',
  templateUrl: './activity-entry.component.html',
  styleUrls: ['./activity-entry.component.scss'],
})
export class ActivityEntryComponent implements OnInit {
  loading = false;

  error: DataError = null;

  activity: ActivityEntryQuery['activity'];
  activityType: Registry;

  rowAction$ = new Subject(); // source

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityEntryGQL: ActivityEntryGQL,
    private deleteActivityRouteGQL: DeleteActivityRouteGQL,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private layoutService: LayoutService,
    private genderizeVerbPipe: GenderizeVerbPipe,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.loading = true;

      this.activityEntryGQL
        .watch({
          id: params.id,
        })
        .valueChanges.subscribe({
          next: (result) => {
            this.loading = false;
            this.activity = result.data.activity;

            this.activityType = ACTIVITY_TYPES.find(
              (t) => t.value == result.data.activity.type
            );

            this.layoutService.$breadcrumbs.next([
              {
                name: 'Plezalni dnevnik',
                path: 'plezalni-dnevnik',
              },
              {
                name:
                  formatDate(this.activity.date, 'dd.MM.YYYY', this.locale) +
                  ', ' +
                  this.activityType.label +
                  ': ' +
                  this.activity.name,
              },
            ]);
          },
          error: () => {
            this.loading = false;
            this.error = {
              message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
            };
          },
        });
    });

    this.rowAction$.subscribe((action: any) => {
      switch (action.action) {
        case 'filterByCrag':
          this.router.navigate([
            '/plezalni-dnevnik/vzponi',
            { cragId: action.item.route.crag.id },
          ]);
          break;
        case 'filterByRoute':
          this.router.navigate([
            '/plezalni-dnevnik/vzponi',
            { routeId: action.item.route.id },
          ]);
          break;
        case 'delete':
          this.deleteActivityRoute(action.item);
          break;
      }
    });
  }

  deleteActivityRoute(activityRoute: ActivityRoute) {
    this.authService.currentUser
      .pipe(
        concatMap((user) => {
          let finePrint = '';

          finePrint += ['redpoint', 'flash', 'onsight'].includes(
            activityRoute.ascentType
          )
            ? `Ker je to tvoj prvi uspešni vzpon v tej smeri, lahko pride do avtomatske spremembe tipa vzpona pri tvojih drugih vnosih za to smer.`
            : '';

          finePrint += ['t_redpoint', 't_flash', 't_onsight'].includes(
            activityRoute.ascentType
          )
            ? `Ker je to tvoj prvi uspešni toprope vzpon v tej smeri, lahko pride do avtomatske spremembe tipa vzpona pri tvojih drugih vnosih za to smer.`
            : '';

          finePrint += ['redpoint', 'flash', 'onsight'].includes(
            activityRoute.ascentType
          )
            ? `<br/>
            Če je to tvoj edini uspešni vzpon v tej smeri, boš s tem ${this.genderizeVerbPipe.transform(
              'pobrisal',
              user.gender
            )} tudi svoj glas o težavnosti te smeri in svojo oceno lepote te smeri.`
            : ``;

          return this.dialog
            .open(ConfirmationDialogComponent, {
              data: {
                title: 'Brisanje vzpona',
                message: `Si ${this.genderizeVerbPipe.transform(
                  'prepričan',
                  user.gender
                )}, da želiš izbrisati ta vzpon?`,
                finePrint: finePrint,
              },
            })
            .afterClosed();
        }),
        filter((response) => response != null),
        switchMap(() =>
          this.deleteActivityRouteGQL.mutate(
            { id: activityRoute.id },
            {
              refetchQueries: [namedOperations.Query.ActivityEntry],
            }
          )
        )
      )
      .subscribe({
        next: () => {
          this.snackbar.open('Vzpon je bil uspešno izbrisan', null, {
            duration: 2000,
          });
        },
        error: () => {
          this.snackbar.open('Pri brisanju vzpona je prišlo do napake', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
