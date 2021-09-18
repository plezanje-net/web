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
import { ClubComponent } from './pages/club/club.component';
import { ActivityEntryComponent } from './pages/activity/activity-entry/activity-entry.component';
import { ActivityInputComponent } from './pages/activity/activity-input/activity-input.component';

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
    path: 'plezalisca/:country/:crag/:route',
    component: RouteComponent,
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
