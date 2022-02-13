import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { ActivityLogComponent } from './pages/activity/activity-log/activity-log.component';
import { ActivityRoutesComponent } from './pages/activity/activity-routes/activity-routes.component';
import { ActivityStatisticsComponent } from './pages/activity/activity-statistics/activity-statistics.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { ClubMembersComponent } from './pages/club/club-members/club-members.component';
import { ClubActivityRoutesComponent } from './pages/club/club-activity-routes/club-activity-routes.component';
import { ClubComponent } from './pages/club/club.component';
import { ActivityEntryComponent } from './pages/activity/activity-entry/activity-entry.component';
import { ActivityInputComponent } from './pages/activity/activity-input/activity-input.component';
import { SearchResultsComponent } from './pages/search/search-results/search-results.component';
import { ConfirmClubMembershipComponent } from './pages/club/confirm-club-membership/confirm-club-membership.component';

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
    path: 'plezalni-dnevnik',
    component: ActivityLogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plezalni-dnevnik/vzponi',
    component: ActivityRoutesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plezalni-dnevnik/statistika',
    component: ActivityStatisticsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plezalni-dnevnik/vpis',
    component: ActivityInputComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plezalni-dnevnik/:id',
    component: ActivityEntryComponent,
    canActivate: [AuthGuard],
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
    path: 'plezalisca/:country/:crag',
    component: CragComponent,
  },
  {
    path: 'alpinizem/stena/:crag',
    component: CragComponent,
  },
  {
    path: 'plezalisca/:country/:crag/:route',
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
    path: 'admin',
    loadChildren: () =>
      import('./management/management.module').then((m) => m.ManagementModule),
  },
  {
    path: 'alpinizem/slapovi',
    loadChildren: () =>
      import('./ice-falls/ice-falls.module').then((m) => m.IceFallsModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
