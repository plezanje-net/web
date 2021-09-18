import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarButtonsComponent } from 'src/app/common/snack-bar-buttons/snack-bar-buttons.component';
import { Crag, Route } from 'src/generated/graphql';

@Component({
  selector: 'app-crag-routes',
  templateUrl: './crag-routes.component.html',
  styleUrls: ['./crag-routes.component.scss'],
})
export class CragRoutesComponent implements OnInit {
  @Input() crag: Crag;

  selectedRoutes: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Used for activity development, remove after
    // const n = 3;
    // for (let i = 0; i < n; i++) {
    //   this.selectedRoutes.push(this.crag.sectors[0].routes[i])
    // }
    // this.addActivity();
  }

  changeSelection(route: Route): void {
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
    }
  }

  addActivity(): void {
    this.authService.guardedAction({}).then(() => {
      // TODO make storage key a constant
      localStorage.setItem('activity-selection', JSON.stringify({
        crag: this.crag,
        routes: this.selectedRoutes,
        created: new Date().getTime(),
      }));

      this.router.navigate(['/plezalni-dnevnik/vpis']);
    });
  }
}
