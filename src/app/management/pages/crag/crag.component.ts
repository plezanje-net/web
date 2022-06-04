import { Component, OnInit } from '@angular/core';
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
export class CragComponent implements OnInit {
  loading: boolean = true;
  error: boolean = false;
  heading: string = '';

  crag: Crag;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private layoutService: LayoutService,
    private managementGetCragGQL: ManagementGetCragGQL
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params.pipe(
        switchMap((params) =>
          params.crag != null
            ? this.managementGetCragGQL.watch({
                id: params.crag,
              }).valueChanges
            : of(null)
        )
      ),
      this.authService.currentUser.asObservable(),
    ]).subscribe({
      next: ([result, user]) => {
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

        if (
          !user.roles.includes('admin') &&
          this.crag.publishStatus == 'published'
        ) {
          this.router.navigate([
            `/admin/uredi-plezalisce/${this.crag.id}/sektorji`,
          ]);
          return;
        }

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
  }
}
