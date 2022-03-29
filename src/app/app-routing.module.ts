import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CragsComponent } from './pages/crags/crags.component';
import { HomeComponent } from './pages/home/home.component';
import { CragComponent } from './pages/crag/crag.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './pages/account/register/register.component';
import { ConfirmAccountComponent } from './pages/account/confirm-account/confirm-account.component';
import { SelectPasswordComponent } from './pages/account/select-password/select-password.component';
import { RouteComponent } from './pages/route/route.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { ClubMembersComponent } from './pages/club/club-members/club-members.component';
import { ClubActivityRoutesComponent } from './pages/club/club-activity-routes/club-activity-routes.component';
import { ClubComponent } from './pages/club/club.component';
import { SearchResultsComponent } from './pages/search/search-results/search-results.component';
import { ConfirmClubMembershipComponent } from './pages/club/confirm-club-membership/confirm-club-membership.component';
import { AlpinismComponent } from './pages/alpinism/alpinism.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'registracija',
    component: RegisterComponent,
  },
  {
    path: 'moj-profil',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'moj-profil/moji-klubi',
    component: ClubsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'moj-profil/moji-klubi/:club',
    component: ClubComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'clani', pathMatch: 'full' },
      { path: 'clani', component: ClubMembersComponent },
      { path: 'vzponi', component: ClubActivityRoutesComponent },
    ],
  },
  {
    path: 'potrditev-clanstva/:clubMemberId/:token',
    component: ConfirmClubMembershipComponent,
  },
  {
    path: 'aktivacija/:id/:token',
    component: ConfirmAccountComponent,
  },
  {
    path: 'menjava-gesla/:id/:token',
    component: SelectPasswordComponent,
  },
  {
    path: 'plezalisca',
    redirectTo: 'plezalisca/slovenija',
    pathMatch: 'full',
  },
  {
    path: 'plezalisca/:country',
    component: CragsComponent,
  },
  {
    path: 'plezalisce/:crag',
    component: CragComponent,
  },
  {
    path: 'alpinizem/stena/:crag',
    component: CragComponent,
  },
  {
    path: 'plezalisce/:crag/smer/:route',
    component: RouteComponent,
  },
  {
    path: 'alpinizem/stena/:crag/smer/:route',
    component: RouteComponent,
  },
  {
    path: 'iskanje/:search',
    component: SearchResultsComponent,
  },
  {
    path: 'plezalni-dnevnik',
    loadChildren: () =>
      import('./activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./management/management.module').then((m) => m.ManagementModule),
  },
  {
    path: 'alpinizem',
    component: AlpinismComponent,
  },
  {
    path: 'alpinizem/vrhovi',
    loadChildren: () =>
      import('./peaks/peaks.module').then((m) => m.PeaksModule),
  },
  {
    path: 'alpinizem/slapovi',
    loadChildren: () =>
      import('./ice-falls/ice-falls.module').then((m) => m.IceFallsModule),
  },
  {
    path: 'o-plezanje-net',
    component: AboutComponent,
    data: {
      hideBreadcrumbs: true,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      // preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
