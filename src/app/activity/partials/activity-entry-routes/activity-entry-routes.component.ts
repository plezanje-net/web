import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concatMap, filter, Subject, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { GenderizeVerbPipe } from 'src/app/shared/pipes/genderize-verb.pipe';
import {
  ActivityRoute,
  DeleteActivityRouteGQL,
  namedOperations,
} from 'src/generated/graphql';

@Component({
  selector: 'app-activity-entry-routes',
  templateUrl: './activity-entry-routes.component.html',
  styleUrls: ['./activity-entry-routes.component.scss'],
})
export class ActivityEntryRoutesComponent implements OnInit {
  @Input() routes: ActivityRoute[];
  @Input() type: 'form' | 'view' = 'view';

  rowAction$ = new Subject(); // source

  constructor(
    private deleteActivityRouteGQL: DeleteActivityRouteGQL,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private genderizeVerbPipe: GenderizeVerbPipe
  ) {}

  ngOnInit(): void {
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
          this.snackBar.open('Vzpon je bil uspešno izbrisan', null, {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open('Pri brisanju vzpona je prišlo do napake', null, {
            panelClass: 'error',
            duration: 3000,
          });
        },
      });
  }
}
