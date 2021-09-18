import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/common/snack-bar-buttons/snack-bar-buttons.component';
import { ActivityFormComponent } from 'src/app/forms/activity-form/activity-form.component';
import { Crag, MyCragSummaryGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit {
  @Input() crag: Crag;

  selectedRoutes: any[] = [];

  ascents: any = {};

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private myCragSummaryGQL: MyCragSummaryGQL
  ) {}

  ngOnInit(): void {
    // Used for activity development, remove after
    // const n = 3;
    // for (let i = 0; i < n; i++) {
    //   this.selectedRoutes.push(this.crag.sectors[0].routes[i])
    // }
    // this.addActivity();

    if (this.authService.currentUser) {
      this.loadActivity();
    }
  }

  changeSelection(route: any) {
    const i = this.selectedRoutes.indexOf(route);
    if (i > -1) {
      this.selectedRoutes.splice(i, 1);
    } else {
      this.selectedRoutes.push(route);
    }

    if (this.selectedRoutes.length > 0) {
      this.snackBar
        .openFromComponent(SnackBarButtonsComponent, {
          horizontalPosition: 'end',
          data: {
            buttons: [
              {
                label: `Shrani v plezalni dnevnik (${this.selectedRoutes.length})`,
              },
            ],
          },
        })
        .onAction()
        .subscribe(() => {
          this.addActivity();
        });
    } else {
      this.snackBar.dismiss();
    }
  }

  addActivity() {
    this.authService.guardedAction({}).then(() => {
      this.dialog.open(ActivityFormComponent, {
        data: {
          crag: this.crag,
          routes: this.selectedRoutes,
        },
        autoFocus: false,
      });
    });
  }

  loadActivity() {
    this.myCragSummaryGQL
      .watch({ input: { cragId: this.crag.id } })
      .valueChanges.subscribe((result) => {
        result.data.myCragSummary.forEach((ascent) => {
          this.ascents[ascent.route.id] = ascent.ascentType;
        });
      });
  }
}
