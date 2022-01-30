import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, Subject, switchMap } from 'rxjs';
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
    private authService: AuthService
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
        concatMap((user) =>
          this.dialog
            .open(ConfirmationDialogComponent, {
              data: {
                title: 'Brisanje vzpona',
                message: `Si prepričan${
                  user.gender == 'F' ? 'a' : ''
                }, da želiš izbrisati ta vzpon?`,
              },
            })
            .afterClosed()
        ),
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
