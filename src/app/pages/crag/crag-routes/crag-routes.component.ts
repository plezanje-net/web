import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/common/snack-bar-buttons/snack-bar-buttons.component';
import { Crag, MyCragSummaryGQL, Route } from 'src/generated/graphql';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit {
  @Input() crag: Crag;

  selectedRoutes: any[] = [];
  selectedRoutesIds: string[] = [];

  ascents: any = {};

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private myCragSummaryGQL: MyCragSummaryGQL,
    private localStorageService: LocalStorageService
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

    // TODO define type
    const storedRouteSelection = this.localStorageService.getItem('activity-selection');
    if (storedRouteSelection && storedRouteSelection.routes.length) {
      this.selectedRoutes = storedRouteSelection.routes;
      this.selectedRoutesIds = this.selectedRoutes.map(route => route.id);
      this.openSnackBar();
    }
  }

  changeSelection(route: Route): void {
    const i = this.selectedRoutes.indexOf(route);
    if (i > -1) {
      this.selectedRoutes.splice(i, 1);
    } else {
      this.selectedRoutes.push(route);
    }

    if (this.selectedRoutes.length > 0) {
      this.openSnackBar();

      this.selectedRoutesIds = this.selectedRoutes.map(selectedRoute => selectedRoute.id);
      this.localStorageService.setItem('activity-selection', {
        crag: this.crag,
        routes: this.selectedRoutes,
      });
    } else {
      this.snackBar.dismiss();
      this.localStorageService.removeItem('activity-selection');
    }
  }

  openSnackBar(): void {
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
  }

  addActivity(): void {
    this.authService.guardedAction({}).then(() => {
      this.router.navigate(['/plezalni-dnevnik/vpis']);
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
