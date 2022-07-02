import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Crag, ManagementGetCragGQL } from 'src/generated/graphql';
import { CragAdminBreadcrumbs } from '../../utils/crag-admin-breadcrumbs';

@Component({
  selector: 'app-crag',
  templateUrl: './crag.component.html',
  styleUrls: ['./crag.component.scss'],
})
export class CragComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: boolean = false;
  heading: string = '';

  crag: Crag;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private layoutService: LayoutService,
    private managementGetCragGQL: ManagementGetCragGQL
  ) {}

  ngOnInit(): void {
    const sub = this.activatedRoute.params
      .pipe(
        switchMap((params) =>
          params.crag != null
            ? this.managementGetCragGQL.watch({
                id: params.crag,
              }).valueChanges
            : of(null)
        )
      )
      .subscribe({
        next: (result) => {
          if (result == null) {
            this.layoutService.$breadcrumbs.next([
              {
                name: 'Dodajanje plezališča',
              },
            ]);
            this.heading = `Dodajanje plezališča`;
            this.loading = false;
            return;
          }

          this.crag = <Crag>result.data.crag;

          this.layoutService.$breadcrumbs.next(
            new CragAdminBreadcrumbs(this.crag).build()
          );
          this.heading = `${this.crag.name}`;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
